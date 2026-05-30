<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\ProdukMart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProdukController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user('sanctum');
        $martId = $request->mart_id ?? $user?->active_mart_id;

        $query = Produk::query()
            ->with(['kategori:id,nama_kategori'])
            ->withAvg('reviews as avg_rating', 'rating')
            ->withCount('reviews as total_reviews')
            ->where('is_active', true)
            ->when($request->kategori_id, fn ($q, $id) => $q->where('kategori_id', $id))
            ->when($request->search, fn ($q, $search) => $q->where('nama_produk', 'like', "%{$search}%"))
            ->when($martId, function ($q) use ($martId) {
                $q->with(['produkMarts' => fn ($pm) => $pm->where('mart_id', $martId)]);
            }, fn ($q) => $q->with('produkMarts'));

        $produk = $query->latest()->paginate(20);

        return $this->success($produk, 'Daftar produk berhasil diambil');
    }

    public function show(string $id): JsonResponse
    {
        $produk = Produk::query()
            ->with([
                'kategori:id,nama_kategori',
                'variants',
                'produkMarts.mart:id,nama_mart',
                'reviews' => fn ($q) => $q->latest()->with('user:id,name'),
            ])
            ->withAvg('reviews as avg_rating', 'rating')
            ->withCount('reviews as total_reviews')
            ->find($id);

        if (! $produk) {
            return $this->error('Produk tidak ditemukan.', null, 404);
        }

        return $this->success($produk, 'Detail produk berhasil diambil');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $produk = Produk::query()
            ->with(['kategori:id,nama_kategori', 'produkMarts.mart:id,nama_mart'])
            ->when($request->kategori_id, fn ($q, $id) => $q->where('kategori_id', $id))
            ->when($request->search, fn ($q, $search) => $q->where('nama_produk', 'like', "%{$search}%"))
            ->latest()
            ->paginate(20);

        return $this->success($produk, 'Daftar produk admin berhasil diambil');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_produk' => ['required', 'string', 'max:255'],
            'kategori_id' => ['required', 'exists:kategori_produk,id'],
            'harga' => ['required', 'integer', 'min:0'],
            'stok' => ['required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string'],
            'gambar' => ['nullable', 'image', 'max:2048'],
        ]);

        $martId = $request->user()->active_mart_id;
        if (! $martId) {
            return $this->error('Mart aktif belum dipilih. Set active_mart_id terlebih dahulu.', null, 422);
        }

        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('produk', 'public');
        }

        $produk = DB::transaction(function () use ($validated, $gambarPath, $martId) {
            $produk = Produk::create([
                'nama_produk' => $validated['nama_produk'],
                'kategori_id' => $validated['kategori_id'],
                'harga' => $validated['harga'],
                'stok' => $validated['stok'],
                'deskripsi' => $validated['deskripsi'] ?? null,
                'gambar' => $gambarPath,
                'is_active' => true,
            ]);

            ProdukMart::create([
                'produk_id' => $produk->id,
                'mart_id' => $martId,
                'stok_lokal' => $validated['stok'],
                'harga_lokal' => $validated['harga'],
            ]);

            return $produk->load(['kategori', 'produkMarts.mart']);
        });

        return $this->success($produk, 'Produk berhasil ditambahkan', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $produk = Produk::find($id);

        if (! $produk) {
            return $this->error('Produk tidak ditemukan.', null, 404);
        }

        $validated = $request->validate([
            'nama_produk' => ['sometimes', 'required', 'string', 'max:255'],
            'kategori_id' => ['sometimes', 'required', 'exists:kategori_produk,id'],
            'harga' => ['sometimes', 'required', 'integer', 'min:0'],
            'stok' => ['sometimes', 'required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string'],
            'gambar' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('gambar')) {
            if ($produk->gambar) {
                Storage::disk('public')->delete($produk->gambar);
            }
            $validated['gambar'] = $request->file('gambar')->store('produk', 'public');
        }

        $produk->update($validated);

        return $this->success($produk->fresh()->load(['kategori', 'produkMarts.mart']), 'Produk berhasil diperbarui');
    }

    public function destroy(string $id): JsonResponse
    {
        $produk = Produk::find($id);

        if (! $produk) {
            return $this->error('Produk tidak ditemukan.', null, 404);
        }

        $produk->delete();

        return $this->success(null, 'Produk berhasil dihapus');
    }
}
