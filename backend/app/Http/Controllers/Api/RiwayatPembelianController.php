<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreRiwayatPembelianRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Resources\RiwayatPembelianResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\DetailPembelian;
use App\Models\Produk;
use App\Models\ProdukMart;
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
            ->with(['details.produk:id,nama_produk,gambar', 'kurir:id,name'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest('tanggal_pesan')
            ->paginate(10);

        return $this->success(
            RiwayatPembelianResource::collection($orders)->response()->getData(true),
            'Riwayat pembelian berhasil diambil'
        );
    }

    public function store(StoreRiwayatPembelianRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        try {
            $order = DB::transaction(function () use ($user, $validated) {
                $total = 0;
                $details = [];

                foreach ($validated['items'] as $item) {
                    $produk = Produk::lockForUpdate()->find($item['produk_id']);

                    if (! $produk || ! $produk->is_active) {
                        throw new \RuntimeException("Produk ID {$item['produk_id']} tidak tersedia.");
                    }

                    $availableStok = $this->availableStok($user, $produk);

                    if ($availableStok < $item['quantity']) {
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
                    'user_id' => $user->id,
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
                    $this->decrementProdukMartStok($user, $detail['produk']->id, $detail['quantity']);
                }

                $cart = Cart::where('user_id', $user->id)->first();
                if ($cart) {
                    CartItem::where('cart_id', $cart->id)->delete();
                }

                NotificationService::send(
                    $user,
                    'Pesanan Produk Berhasil 🛒',
                    "Pesanan {$riwayat->order_id} berhasil dibuat.",
                    'produk'
                );

                return $riwayat->load(['details.produk', 'kurir', 'user']);
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
        $order = RiwayatPembelian::with(['details.produk:id,nama_produk,gambar,harga', 'kurir:id,name', 'user:id,name,email'])
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
            ->when($request->date_from, fn ($q, $date) => $q->whereDate('tanggal_pesan', '>=', $date))
            ->when($request->date_to, fn ($q, $date) => $q->whereDate('tanggal_pesan', '<=', $date))
            ->latest('tanggal_pesan')
            ->paginate(15);

        return $this->success(
            RiwayatPembelianResource::collection($orders)->response()->getData(true),
            'Daftar pesanan admin berhasil diambil'
        );
    }

    public function updateStatus(UpdateOrderStatusRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();

        $order = RiwayatPembelian::with(['user', 'details'])->find($id);

        if (! $order) {
            return $this->error('Pesanan tidak ditemukan.', null, 404);
        }

        $this->authorize('updateStatus', $order);

        if ($validated['status'] === 'delivering' && empty($validated['kurir_id'])) {
            return $this->error('Kurir wajib dipilih saat status delivering.', null, 422);
        }

        $previousStatus = $order->status;

        DB::transaction(function () use ($order, $validated, $previousStatus) {
            if ($validated['status'] === 'cancelled' && $previousStatus !== 'cancelled') {
                foreach ($order->details as $detail) {
                    if ($detail->produk_id) {
                        Produk::where('id', $detail->produk_id)->increment('stok', $detail->jumlah);
                        ProdukMart::where('produk_id', $detail->produk_id)->increment('stok_lokal', $detail->jumlah);
                    }
                }
            }

            $order->update([
                'status' => $validated['status'],
                'kurir_id' => $validated['kurir_id'] ?? $order->kurir_id,
            ]);
        });

        [$title, $message] = match ($validated['status']) {
            'processing' => ['Pesanan sedang diproses 📦', "Pesanan {$order->order_id} sedang diproses."],
            'delivering' => ['Pesanan sedang diantar 🛵', "Pesanan {$order->order_id} sedang diantar."],
            'completed' => ['Pesanan Telah Sampai ✅', "Pesanan {$order->order_id} telah sampai."],
            'cancelled' => ['Pesanan Dibatalkan ❌', "Pesanan {$order->order_id} dibatalkan."],
            default => ['Update Pesanan', "Pesanan {$order->order_id} diperbarui."],
        };

        NotificationService::send($order->user, $title, $message, 'order_update');

        AuditService::log('order_status_update', RiwayatPembelian::class, $order->id, $request);

        return $this->success(
            RiwayatPembelianResource::make($order->fresh()->load(['user', 'kurir', 'details.produk'])),
            'Status pesanan berhasil diperbarui'
        );
    }

    private function availableStok($user, Produk $produk): int
    {
        if ($user->active_mart_id) {
            $produkMart = ProdukMart::where('produk_id', $produk->id)
                ->where('mart_id', $user->active_mart_id)
                ->lockForUpdate()
                ->first();

            if ($produkMart) {
                return (int) $produkMart->stok_lokal;
            }
        }

        return (int) $produk->stok;
    }

    private function decrementProdukMartStok($user, int $produkId, int $qty): void
    {
        if (! $user->active_mart_id) {
            return;
        }

        ProdukMart::where('produk_id', $produkId)
            ->where('mart_id', $user->active_mart_id)
            ->decrement('stok_lokal', $qty);
    }
}
