<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriProduk;
use Illuminate\Http\JsonResponse;

class KategoriProdukController extends Controller
{
    public function index(): JsonResponse
    {
        $kategori = KategoriProduk::query()
            ->withCount('produks')
            ->orderBy('nama_kategori')
            ->get();

        return $this->success($kategori, 'Daftar kategori berhasil diambil');
    }
}
