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
use App\Models\User;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RiwayatPembelianController extends Controller
{
    private const ONGKIR_DELIVERY = 5000;

    /**
     * @OA\Get(
     *     path="/riwayat-pembelian",
     *     tags={"Orders"},
     *     summary="List authenticated user's orders",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string", enum={"pending","processing","delivering","completed","cancelled"})),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Paginated order history", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $orders = RiwayatPembelian::query()
            ->where('user_id', $request->user()->id)
            ->with(['details.produk.produkMarts.mart', 'kurir:id,name'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest('tanggal_pesan')
            ->paginate(10);

        return $this->success(
            RiwayatPembelianResource::collection($orders)->response()->getData(true),
            'Riwayat pembelian berhasil diambil'
        );
    }

    /**
     * @OA\Post(
     *     path="/riwayat-pembelian",
     *     tags={"Orders"},
     *     summary="Create order (checkout)",
     *     description="Server-side price calculation, stock deduction, cart clearing, and notification in a DB transaction.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/CheckoutRequest")),
     *
     *     @OA\Response(response=201, description="Order created", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=422, description="Insufficient stock or invalid items")
     * )
     */
    public function store(StoreRiwayatPembelianRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        try {
            $order = DB::transaction(function () use ($user, $validated) {
                $subtotal = 0;
                $details = [];
                $uniqueMarts = [];

                foreach ($validated['items'] as $item) {
                    $produk = Produk::lockForUpdate()->find($item['produk_id']);

                    if (! $produk || ! $produk->is_active) {
                        throw new RuntimeException("Produk ID {$item['produk_id']} tidak tersedia.");
                    }

                    // Tentukan mart untuk item ini
                    $martId = $item['mart_id'] ?? null;
                    if (!$martId && $user->active_mart_id) {
                        $existsInActive = ProdukMart::where('produk_id', $produk->id)
                            ->where('mart_id', $user->active_mart_id)
                            ->exists();
                        if ($existsInActive) {
                            $martId = $user->active_mart_id;
                        }
                    }
                    if (!$martId) {
                        $firstMart = ProdukMart::where('produk_id', $produk->id)->first();
                        $martId = $firstMart ? $firstMart->mart_id : 1;
                    }

                    $uniqueMarts[$martId] = true;

                    $availableStok = $this->availableStokForMart($martId, $produk);

                    if ($availableStok < $item['quantity']) {
                        throw new RuntimeException("Stok {$produk->nama_produk} tidak mencukupi.");
                    }

                    $hargaSatuan = $this->resolveHargaForMart($martId, $produk);
                    $itemSubtotal = $hargaSatuan * $item['quantity'];
                    $subtotal += $itemSubtotal;

                    $details[] = [
                        'produk' => $produk,
                        'mart_id' => $martId,
                        'quantity' => $item['quantity'],
                        'harga_satuan' => $hargaSatuan,
                        'subtotal' => $itemSubtotal,
                    ];
                }

                $martsCount = count($uniqueMarts);
                $ongkir = $validated['tipe_layanan'] === 'delivery' ? (self::ONGKIR_DELIVERY * $martsCount) : 0;
                $layanan = $subtotal > 0 ? 1000 : 0;

                $riwayat = RiwayatPembelian::create([
                    'user_id' => $user->id,
                    'order_id' => 'TM-'.strtoupper(uniqid()),
                    'tipe_layanan' => $validated['tipe_layanan'],
                    'status' => 'pending',
                    'total' => $subtotal + $ongkir + $layanan,
                    'ongkir' => $ongkir,
                    'biaya_layanan' => $layanan,
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
                    $this->decrementProdukMartStokForMart($detail['mart_id'], $detail['produk']->id, $detail['quantity']);
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
        } catch (RuntimeException $e) {
            return $this->error($e->getMessage(), null, 422);
        }

        AuditService::log('order_create', RiwayatPembelian::class, $order->id, $request);

        return $this->success(
            RiwayatPembelianResource::make($order),
            'Pesanan berhasil dibuat',
            201
        );
    }

    /**
     * @OA\Get(
     *     path="/riwayat-pembelian/{id}",
     *     tags={"Orders"},
     *     summary="Get order detail",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Order detail", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = RiwayatPembelian::with([
            'details.produk.produkMarts.mart',
            'kurir:id,name',
            'user:id,name,email',
        ])->find($id);

        if (! $order) {
            return $this->error('Pesanan tidak ditemukan.', null, 404);
        }

        $this->authorize('view', $order);

        return $this->success(
            RiwayatPembelianResource::make($order),
            'Detail pesanan berhasil diambil'
        );
    }

    /**
     * @OA\Get(
     *     path="/admin/riwayat-pembelian",
     *     tags={"Admin","Orders"},
     *     summary="Admin: list all orders with filters",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="mart_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="date_from", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="date_to", in="query", @OA\Schema(type="string", format="date")),
     *
     *     @OA\Response(response=200, description="Paginated admin orders", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $orders = RiwayatPembelian::query()
            ->with([
                'user:id,name,email,phone',
                'kurir:id,name',
                'details.produk:id,nama_produk',
            ])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('mart_id'), function ($q, $martId) {
                $q->whereHas('details.produk.produkMarts', fn ($pm) => $pm->where('mart_id', $martId));
            })
            ->when($request->query('date_from'), fn ($q, $date) => $q->whereDate('tanggal_pesan', '>=', $date))
            ->when($request->query('date_to'), fn ($q, $date) => $q->whereDate('tanggal_pesan', '<=', $date))
            ->latest('tanggal_pesan')
            ->paginate(15);

        return $this->success(
            RiwayatPembelianResource::collection($orders)->response()->getData(true),
            'Daftar pesanan admin berhasil diambil'
        );
    }

    /**
     * @OA\Put(
     *     path="/admin/riwayat-pembelian/{id}/status",
     *     tags={"Admin","Orders"},
     *     summary="Admin: update order status",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/UpdateOrderStatusRequest")),
     *
     *     @OA\Response(response=200, description="Status updated", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
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
                $this->restoreStock($order);
            }

            $order->update([
                'status' => $validated['status'],
                'kurir_id' => $validated['status'] === 'delivering'
                    ? $validated['kurir_id']
                    : ($validated['kurir_id'] ?? $order->kurir_id),
            ]);
        });

        [$title, $message] = match ($validated['status']) {
            'processing' => ['Pesanan sedang diproses 📦', "Pesanan {$order->order_id} sedang diproses."],
            'delivering' => ['Pesanan sedang diantar 🛵', "Pesanan {$order->order_id} sedang diantar."],
            'completed' => ['Pesanan Telah Sampai ✅', "Pesanan {$order->order_id} telah sampai."],
            'cancelled' => ['Pesanan Dibatalkan ❌', "Pesanan {$order->order_id} dibatalkan."],
            default => ['Update Pesanan', "Pesanan {$order->order_id} diperbarui."],
        };

        NotificationService::send($order->user, $title, $message, 'produk');

        AuditService::log('order_status_update', RiwayatPembelian::class, $order->id, $request);

        return $this->success(
            RiwayatPembelianResource::make($order->fresh()->load(['user', 'kurir', 'details.produk'])),
            'Status pesanan berhasil diperbarui'
        );
    }

    private function resolveHargaForMart(int $martId, Produk $produk): float
    {
        $produkMart = ProdukMart::where('produk_id', $produk->id)
            ->where('mart_id', $martId)
            ->first();

        if ($produkMart?->harga_lokal !== null) {
            return (float) $produkMart->harga_lokal;
        }

        return (float) $produk->harga;
    }

    private function availableStokForMart(int $martId, Produk $produk): int
    {
        $produkMart = ProdukMart::where('produk_id', $produk->id)
            ->where('mart_id', $martId)
            ->lockForUpdate()
            ->first();

        if ($produkMart) {
            return (int) $produkMart->stok_lokal;
        }

        return (int) $produk->stok;
    }

    private function decrementProdukMartStokForMart(int $martId, int $produkId, int $qty): void
    {
        ProdukMart::where('produk_id', $produkId)
            ->where('mart_id', $martId)
            ->decrement('stok_lokal', $qty);
    }

    private function restoreStock(RiwayatPembelian $order): void
    {
        $martId = $order->user?->active_mart_id;

        foreach ($order->details as $detail) {
            if (! $detail->produk_id) {
                continue;
            }

            Produk::where('id', $detail->produk_id)->lockForUpdate()->increment('stok', $detail->jumlah);

            $itemMartId = null;
            if ($martId) {
                $exists = ProdukMart::where('produk_id', $detail->produk_id)
                    ->where('mart_id', $martId)
                    ->exists();
                if ($exists) {
                    $itemMartId = $martId;
                }
            }
            if (!$itemMartId) {
                $firstMart = ProdukMart::where('produk_id', $detail->produk_id)->first();
                $itemMartId = $firstMart ? $firstMart->mart_id : null;
            }

            if ($itemMartId) {
                ProdukMart::where('produk_id', $detail->produk_id)
                    ->where('mart_id', $itemMartId)
                    ->increment('stok_lokal', $detail->jumlah);
            }
        }
    }
}
