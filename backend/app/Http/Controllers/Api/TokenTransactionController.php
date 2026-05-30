<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TokenTransaction;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TokenTransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $transactions = TokenTransaction::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return $this->success($transactions, 'Riwayat token berhasil diambil');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nominal' => ['required', 'in:20000,50000,100000,200000,500000'],
            'metode_pembayaran' => ['required', 'in:COD,MIDTRANS'],
        ]);

        do {
            $nomorToken = collect(range(1, 20))
                ->map(fn () => (string) random_int(0, 9))
                ->join('');
        } while (TokenTransaction::where('nomor_token', $nomorToken)->exists());

        $transaction = TokenTransaction::create([
            'user_id' => $request->user()->id,
            'nominal' => $validated['nominal'],
            'nomor_token' => $nomorToken,
            'status' => 'completed',
            'metode_pembayaran' => $validated['metode_pembayaran'],
        ]);

        NotificationService::send(
            $request->user(),
            'Token Listrik Berhasil ⚡',
            "Token listrik Rp ".number_format($validated['nominal'], 0, ',', '.')." berhasil dibuat. Nomor token: {$nomorToken}",
            'token'
        );

        return $this->success($transaction, 'Token listrik berhasil dibuat', 201);
    }
}
