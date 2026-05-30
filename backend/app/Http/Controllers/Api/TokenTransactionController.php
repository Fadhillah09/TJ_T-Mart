<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Token\StoreTokenRequest;
use App\Http\Resources\TokenTransactionResource;
use App\Models\TokenTransaction;
use App\Services\AuditService;
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

        return $this->success(
            TokenTransactionResource::collection($transactions)->response()->getData(true),
            'Riwayat token berhasil diambil'
        );
    }

    public function store(StoreTokenRequest $request): JsonResponse
    {
        $validated = $request->validated();

        do {
            $nomorToken = str_pad((string) mt_rand(0, 99999999999999999999), 20, '0', STR_PAD_LEFT);
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
            'Token listrik Rp '.number_format((float) $validated['nominal'], 0, ',', '.')." berhasil dibuat. Nomor token: {$nomorToken}",
            'token'
        );

        AuditService::log('token_purchase', TokenTransaction::class, $transaction->id, $request);

        return $this->success(
            TokenTransactionResource::make($transaction),
            'Token listrik berhasil dibuat',
            201
        );
    }
}
