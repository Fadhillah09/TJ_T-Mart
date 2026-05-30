<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriProduk;
use Illuminate\Http\JsonResponse;

class KategoriProdukController extends Controller
{
    /**
     * @OA\Get(
     *     path="/kategori",
     *     tags={"Public"},
     *     summary="List product categories",
     *     description="Includes produk_count for active products only.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Category list", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function index(): JsonResponse
    {
        $kategori = KategoriProduk::query()
            ->withCount(['produks as produk_count' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('nama_kategori')
            ->get();

        return $this->success($kategori, 'Daftar kategori berhasil diambil');
    }
}
