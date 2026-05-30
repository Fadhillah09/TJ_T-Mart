<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RiwayatPembelianResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\DetailPembelian;
use App\Models\Produk;
use App\Models\RiwayatPembelian;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RiwayatPembelianController extends Controller
{
    private const ONGKIR_DELIVERY = 5000;

    public function index(Request $request): JsonResponse
    {
        $orders = RiwayatPembelian::query()
            ->where('user_id', $request->user()->id)
            ->with(['details.produk:id,nama_produk,gambar'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest('tanggal_pesan')
            ->paginate(10);

        return $this->success(
            RiwayatPembelianResource::collection($orders)->response()->getData(true),
            'Riwayat pembelian berhasil diambil'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tipe_layanan' => ['required', 'in:pickup,delivery'],
            'metode_pembayaran' => ['required', 'in:COD,MIDTRANS'],
            'alamat_pengantaran' => ['required_if:tipe_layanan,delivery', 'nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.produk_id' => ['required', 'integer', 'exists:produk,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $order = DB::transaction(function () use ($request, $validated) {
                $total = 0;
                $details = [];

                foreach ($validated['items'] as $item) {
                    $produk = Produk::lockForUpdate()->find($item['produk_id']);

                    if (! $produk || ! $produk->is_active) {
                        throw new \RuntimeException("Produk ID {$item['produk_id']} tidak tersedia.");
                    }

                    if ($produk->stok < $item['quantity']) {
                        throw new \RuntimeException("Stok {$produk->nama_produk} tidak mencukupi.");
                    }

                    $subtotal = (float) $produk->harga * $item['quantity'];
                    $total += $subtotal;

                    $details[] = [
                        'produk' => $produk,
                        'quantity' => $item['quantity'],
                        'harga_satuan' => $produk->harga,
                        'subtotal' => $subtotal,
                    ];
                }

                $ongkir = $validated['tipe_layanan'] === 'delivery' ? self::ONGKIR_DELIVERY : 0;

                $riwayat = RiwayatPembelian::create([
                    'user_id' => $request->user()->id,
                    'order_id' => 'TM-'.strtoupper(uniqid()),
                    'tipe_layanan' => $validated['tipe_layanan'],
                    'status' => 'pending',
                    'total' => $total + $ongkir,
                    'ongkir' => $ongkir,
                    'metode_pembayaran' => $validated['metode_pembayaran'],
                    'alamat_pengantaran' => $validated['alamat_pengantaran'] ?? null,
                    'tanggal_pesan' => now(),
                ]);

                foreach ($details as $detail) {
                    DetailPembelian::create([
                        'riwayat_pembelian_id' => $riwayat->id,
                        'produk_id' => $detail['produk']->id,
                        'nama_produk' => $detail['produk']->nama_produk,
                        'harga_satuan' => $detail['harga_satuan'],
                        'jumlah' => $detail['quantity'],
                        'subtotal' => $detail['subtotal'],
                    ]);

                    $detail['produk']->decrement('stok', $detail['quantity']);
                }

                $cart = Cart::where('user_id', $request->user()->id)->first();
                if ($cart) {
                    CartItem::where('cart_id', $cart->id)->delete();
                }

                NotificationService::send(
                    $request->user(),
                    'Pesanan Produk Berhasil 🛒',
                    "Pesanan {$riwayat->order_id} berhasil dibuat.",
                    'produk'
                );

                return $riwayat->load(['details.produk']);
            });
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, 422);
        }

        AuditService::log('order_create', RiwayatPembelian::class, $order->id, $request);

        return $this->success(
            RiwayatPembelianResource::make($order),
            'Pesanan berhasil dibuat',
            201
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $order = RiwayatPembelian::with(['details.produk:id,nama_produk,gambar,harga'])
            ->find($id);

        if (! $order) {
            return $this->error('Pesanan tidak ditemukan.', null, 404);
        }

        $this->authorize('view', $order);

        return $this->success(
            RiwayatPembelianResource::make($order),
            'Detail pesanan berhasil diambil'
        );
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $orders = RiwayatPembelian::query()
            ->with([
                'user:id,name,email,phone',
                'kurir:id,name',
                'details.produk:id,nama_produk',
            ])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->mart_id, function ($q, $martId) {
                $q->whereHas('details.produk.produkMarts', fn ($pm) => $pm->where('mart_id', $martId));
            })
            ->latest('tanggal_pesan')
            ->paginate(15);

        return $this->success(
            RiwayatPembelianResource::collection($orders)->response()->getData(true),
            'Daftar pesanan admin berhasil diambil'
        );
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,delivering,completed,cancelled'],
            'kurir_id' => ['required_if:status,delivering', 'nullable', 'integer', 'exists:users,id'],
        ]);

        $order = RiwayatPembelian::with('user')->find($id);

        if (! $order) {
            return $this->error('Pesanan tidak ditemukan.', null, 404);
        }

        $this->authorize('updateStatus', $order);

        if ($validated['status'] === 'delivering' && empty($validated['kurir_id'])) {
            return $this->error('Kurir wajib dipilih saat status delivering.', null, 422);
        }

        $order->update([
            'status' => $validated['status'],
            'kurir_id' => $validated['kurir_id'] ?? $order->kurir_id,
        ]);

        if ($validated['status'] === 'cancelled') {
            AuditService::log('order_cancel', RiwayatPembelian::class, $order->id, $request);
        }

        $statusLabel = match ($validated['status']) {
            'pending' => 'Menunggu',
            'processing' => 'Diproses',
            'delivering' => 'Sedang dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default => $validated['status'],
        };

        NotificationService::send(
            $order->user,
            'Update Pesanan',
            "Pesanan {$order->order_id} sekarang berstatus: {$statusLabel}.",
            'order_update'
        );

        return $this->success(
            RiwayatPembelianResource::make($order->fresh()->load(['user', 'kurir', 'details'])),
            'Status pesanan berhasil diperbarui'
        );
    }
}
