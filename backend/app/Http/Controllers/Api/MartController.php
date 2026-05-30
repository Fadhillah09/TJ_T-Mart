<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mart;
use Illuminate\Http\JsonResponse;

class MartController extends Controller
{
    public function index(): JsonResponse
    {
        $marts = Mart::query()
            ->where('is_active', true)
            ->withCount(['lokasis as lokasi_delivery_count', 'produkMarts as produk_count'])
            ->orderBy('nama_mart')
            ->get();

        return $this->success($marts, 'Daftar mart berhasil diambil');
    }

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
