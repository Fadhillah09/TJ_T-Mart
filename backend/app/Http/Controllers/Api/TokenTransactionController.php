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
use Illuminate\Support\Facades\DB;

class TokenTransactionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/token",
     *     tags={"Token"},
     *     summary="List user's token transactions",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(response=200, description="Paginated token history", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/token",
     *     tags={"Token"},
     *     summary="Purchase electricity token",
     *     description="Generates a 20-digit token instantly. Status set to completed.",
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/TokenRequest")),
     *
     *     @OA\Response(response=201, description="Token purchased", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function store(StoreTokenRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $transaction = DB::transaction(function () use ($request, $validated) {
            do {
                $nomorToken = str_pad((string) mt_rand(0, 999999999), 20, '0', STR_PAD_LEFT);
            } while (TokenTransaction::where('nomor_token', $nomorToken)->exists());

            $token = TokenTransaction::create([
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

            return $token;
        });

        AuditService::log('token_purchase', TokenTransaction::class, $transaction->id, $request);

        return $this->success(
            TokenTransactionResource::make($transaction),
            'Token listrik berhasil dibuat',
            201
        );
    }
}
