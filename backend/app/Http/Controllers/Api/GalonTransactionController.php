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

class GalonTransactionController extends Controller
{
    private const GALON_PRICES = [
        'Galon Baru + Isi' => 45000,
        'Galon 19L (Isi Ulang)' => 18000,
    ];

    private const ONGKIR_PER_GALON = 3000;

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

    public function store(StoreGalonRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $hargaSatuan = self::GALON_PRICES[$validated['nama_galon']];
        $ongkir = $validated['metode_pengiriman'] === 'antar'
            ? self::ONGKIR_PER_GALON * $validated['jumlah']
            : 0;

        $orderId = $validated['metode_pembayaran'] === 'MIDTRANS'
            ? 'GALON-'.time()
            : null;

        $transaction = GalonTransaction::create([
            'user_id' => $request->user()->id,
            'nama_galon' => $validated['nama_galon'],
            'harga_satuan' => $hargaSatuan,
            'jumlah' => $validated['jumlah'],
            'total_harga' => ($hargaSatuan * $validated['jumlah']) + $ongkir,
            'ongkir' => $ongkir,
            'order_id' => $orderId,
            'catatan' => $validated['catatan'] ?? null,
            'status' => 'pending',
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'metode_pengiriman' => $validated['metode_pengiriman'],
            'waktu_transaksi' => now(),
        ]);

        NotificationService::send(
            $request->user(),
            'Pesanan Galon Berhasil 💧',
            "Pesanan galon {$validated['nama_galon']} berhasil dibuat.",
            'galon'
        );

        return $this->success(
            GalonTransactionResource::make($transaction),
            'Pesanan galon berhasil dibuat',
            201
        );
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $transactions = GalonTransaction::query()
            ->with('user:id,name,email,phone')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->metode_pengiriman, fn ($q, $metode) => $q->where('metode_pengiriman', $metode))
            ->latest('waktu_transaksi')
            ->paginate(15);

        return $this->success(
            GalonTransactionResource::collection($transactions)->response()->getData(true),
            'Daftar pesanan galon admin berhasil diambil'
        );
    }

    public function updateStatus(UpdateGalonStatusRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();

        $transaction = GalonTransaction::with('user')->find($id);

        if (! $transaction) {
            return $this->error('Transaksi galon tidak ditemukan.', null, 404);
        }

        $this->authorize('updateStatus', $transaction);

        $transaction->update(['status' => $validated['status']]);

        NotificationService::send(
            $transaction->user,
            'Update Pesanan Galon',
            "Pesanan galon berstatus: {$validated['status']}.",
            'galon'
        );

        AuditService::log('galon_status_update', GalonTransaction::class, $transaction->id, $request);

        return $this->success(
            GalonTransactionResource::make($transaction->fresh()->load('user')),
            'Status pesanan galon berhasil diperbarui'
        );
    }
}
