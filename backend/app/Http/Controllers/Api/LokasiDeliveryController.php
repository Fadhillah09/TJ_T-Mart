<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LokasiDelivery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LokasiDeliveryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/lokasi",
     *     tags={"Public"},
     *     summary="List delivery locations",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="mart_id", in="query", description="Filter by mart", @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Location list", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $lokasi = LokasiDelivery::query()
            ->with('mart:id,nama_mart')
            ->when($request->mart_id, fn ($q, $martId) => $q->where('mart_id', $martId))
            ->orderBy('nama_lokasi')
            ->get();

        return $this->success($lokasi, 'Daftar lokasi berhasil diambil');
    }
}
