<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    /**
     * @OA\Get(
     *     path="/banner",
     *     tags={"Public"},
     *     summary="List active banners",
     *     description="Returns banners ordered by sort_order ascending.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Banner list", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function index(): JsonResponse
    {
        $banners = Banner::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->success($banners, 'Daftar banner berhasil diambil');
    }
}
