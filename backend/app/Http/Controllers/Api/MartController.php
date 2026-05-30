<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mart;
use Illuminate\Http\JsonResponse;

class MartController extends Controller
{
    /**
     * @OA\Get(
     *     path="/mart",
     *     tags={"Mart"},
     *     summary="List active marts",
     *     description="Returns all active marts with lokasi_delivery and produk counts.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Mart list", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(): JsonResponse
    {
        $marts = Mart::query()
            ->where('is_active', true)
            ->withCount(['lokasis as lokasi_delivery_count', 'produkMarts as produk_count'])
            ->orderBy('nama_mart')
            ->get();

        return $this->success($marts, 'Daftar mart berhasil diambil');
    }

    /**
     * @OA\Get(
     *     path="/mart/{id}",
     *     tags={"Mart"},
     *     summary="Get mart detail",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Mart detail", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=404, description="Mart not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $mart = Mart::with('lokasis')
            ->withCount(['lokasis as lokasi_delivery_count', 'produkMarts as produk_count'])
            ->where('is_active', true)
            ->find($id);

        if (! $mart) {
            return $this->error('Mart tidak ditemukan.', null, 404);
        }

        return $this->success($mart, 'Detail mart berhasil diambil');
    }
}
