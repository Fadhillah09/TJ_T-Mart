<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Galon\StoreGalonRequest;
use App\Http\Requests\Galon\UpdateGalonStatusRequest;
use App\Http\Resources\GalonTransactionResource;
use App\Models\GalonTransaction;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GalonTransactionController extends Controller
{
    private const GALON_PRICES = [
        'Galon Baru + Isi' => 45000,
        'Galon 19L (Isi Ulang)' => 18000,
    ];

    private const ONGKIR_PER_GALON = 3000;

    /**
     * @OA\Get(
     *     path="/galon",
     *     tags={"Galon"},
     *     summary="List user's galon transactions",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(response=200, description="Paginated galon history", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $transactions = GalonTransaction::query()
            ->where('user_id', $request->user()->id)
            ->latest('waktu_transaksi')
            ->paginate(10);

        return $this->success(
            GalonTransactionResource::collection($transactions)->response()->getData(true),
            'Riwayat galon berhasil diambil'
        );
    }

    /**
     * @OA\Post(
     *     path="/galon",
     *     tags={"Galon"},
     *     summary="Create galon water order",
     *     description="Prices calculated server-side. Galon Baru + Isi = 45000, Isi Ulang = 18000. Delivery fee 3000/gallon for 'antar'.",
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/GalonRequest")),
     *
     *     @OA\Response(response=201, description="Galon order created", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function store(StoreGalonRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $transaction = DB::transaction(function () use ($request, $validated) {
            $hargaSatuan = self::GALON_PRICES[$validated['nama_galon']];
            $ongkir = $validated['metode_pengiriman'] === 'antar'
                ? self::ONGKIR_PER_GALON * $validated['jumlah']
                : 0;

            $galon = GalonTransaction::create([
                'user_id' => $request->user()->id,
                'nama_galon' => $validated['nama_galon'],
                'harga_satuan' => $hargaSatuan,
                'jumlah' => $validated['jumlah'],
                'total_harga' => ($hargaSatuan * $validated['jumlah']) + $ongkir,
                'ongkir' => $ongkir,
                'order_id' => 'GALON-'.strtoupper(uniqid()),
                'catatan' => $validated['catatan'] ?? null,
                'status' => 'pending',
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'metode_pengiriman' => $validated['metode_pengiriman'],
                'waktu_transaksi' => now(),
            ]);

            NotificationService::send(
                $request->user(),
                'Pesanan Galon Berhasil 💧',
                "Pesanan galon {$galon->order_id} ({$validated['nama_galon']}) berhasil dibuat.",
                'galon'
            );

            return $galon;
        });

        return $this->success(
            GalonTransactionResource::make($transaction),
            'Pesanan galon berhasil dibuat',
            201
        );
    }

    /**
     * @OA\Get(
     *     path="/admin/galon",
     *     tags={"Admin","Galon"},
     *     summary="Admin: list all galon transactions",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="metode_pengiriman", in="query", @OA\Schema(type="string", enum={"ambil","antar"})),
     *
     *     @OA\Response(response=200, description="Admin galon list", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $transactions = GalonTransaction::query()
            ->with('user:id,name,email,phone')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('metode_pengiriman'), fn ($q, $metode) => $q->where('metode_pengiriman', $metode))
            ->latest('waktu_transaksi')
            ->paginate(15);

        return $this->success(
            GalonTransactionResource::collection($transactions)->response()->getData(true),
            'Daftar pesanan galon admin berhasil diambil'
        );
    }

    /**
     * @OA\Put(
     *     path="/admin/galon/{id}/status",
     *     tags={"Admin","Galon"},
     *     summary="Admin: update galon order status",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(
     *         required=true,
     *
     *         @OA\JsonContent(
     *             required={"status"},
     *
     *             @OA\Property(property="status", type="string", enum={"pending","paid","delivering","completed","cancelled"})
     *         )
     *     ),
     *
     *     @OA\Response(response=200, description="Status updated", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function updateStatus(UpdateGalonStatusRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();

        $transaction = GalonTransaction::with('user')->find($id);

        if (! $transaction) {
            return $this->error('Transaksi galon tidak ditemukan.', null, 404);
        }

        $this->authorize('updateStatus', $transaction);

        DB::transaction(function () use ($transaction, $validated) {
            $transaction->update(['status' => $validated['status']]);
        });

        [$title, $message] = match ($validated['status']) {
            'paid' => ['Pembayaran Galon Diterima 💰', "Pesanan {$transaction->order_id} telah dibayar."],
            'delivering' => ['Galon Sedang Diantar 🚚', "Pesanan {$transaction->order_id} sedang diantar."],
            'completed' => ['Pesanan Galon Selesai ✅', "Pesanan {$transaction->order_id} telah selesai."],
            'cancelled' => ['Pesanan Galon Dibatalkan ❌', "Pesanan {$transaction->order_id} dibatalkan."],
            default => ['Update Pesanan Galon', "Pesanan {$transaction->order_id} berstatus: {$validated['status']}."],
        };

        NotificationService::send($transaction->user, $title, $message, 'galon');

        AuditService::log('galon_status_update', GalonTransaction::class, $transaction->id, $request);

        return $this->success(
            GalonTransactionResource::make($transaction->fresh()->load('user')),
            'Status pesanan galon berhasil diperbarui'
        );
    }
}
