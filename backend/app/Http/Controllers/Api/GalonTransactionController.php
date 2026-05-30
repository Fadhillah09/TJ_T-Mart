<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalonTransaction;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalonTransactionController extends Controller
{
    private const GALON_PRICES = [
        'Galon Baru + Isi' => 75000,
        'Galon 19L (Isi Ulang)' => 18000,
    ];

    private const ONGKIR_PER_GALON = 3000;

    public function index(Request $request): JsonResponse
    {
        $transactions = GalonTransaction::query()
            ->where('user_id', $request->user()->id)
            ->latest('waktu_transaksi')
            ->paginate(10);

        return $this->success($transactions, 'Riwayat galon berhasil diambil');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_galon' => ['required', 'in:Galon Baru + Isi,Galon 19L (Isi Ulang)'],
            'jumlah' => ['required', 'integer', 'min:1'],
            'metode_pembayaran' => ['required', 'in:COD,MIDTRANS'],
            'metode_pengiriman' => ['required', 'in:ambil,antar'],
            'catatan' => ['nullable', 'string'],
        ]);

        $hargaSatuan = self::GALON_PRICES[$validated['nama_galon']];
        $totalHarga = $hargaSatuan * $validated['jumlah'];
        $ongkir = $validated['metode_pengiriman'] === 'antar'
            ? self::ONGKIR_PER_GALON * $validated['jumlah']
            : 0;

        $orderId = $validated['metode_pembayaran'] === 'MIDTRANS'
            ? 'GL-'.strtoupper(uniqid())
            : 'GL-'.strtoupper(uniqid());

        $transaction = GalonTransaction::create([
            'user_id' => $request->user()->id,
            'nama_galon' => $validated['nama_galon'],
            'harga_satuan' => $hargaSatuan,
            'jumlah' => $validated['jumlah'],
            'total_harga' => $totalHarga + $ongkir,
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
            "Pesanan galon {$transaction->order_id} berhasil dibuat.",
            'galon'
        );

        return $this->success($transaction, 'Pesanan galon berhasil dibuat', 201);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $transactions = GalonTransaction::query()
            ->with('user:id,name,email,phone')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest('waktu_transaksi')
            ->paginate(15);

        return $this->success($transactions, 'Daftar pesanan galon admin berhasil diambil');
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,paid,delivering,completed,cancelled'],
        ]);

        $transaction = GalonTransaction::with('user')->find($id);

        if (! $transaction) {
            return $this->error('Transaksi galon tidak ditemukan.', null, 404);
        }

        $transaction->update(['status' => $validated['status']]);

        NotificationService::send(
            $transaction->user,
            'Update Pesanan Galon',
            "Pesanan galon {$transaction->order_id} berstatus: {$validated['status']}.",
            'galon'
        );

        return $this->success($transaction->fresh()->load('user'), 'Status pesanan galon berhasil diperbarui');
    }
}
