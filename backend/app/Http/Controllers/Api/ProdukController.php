<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produk\StoreProdukRequest;
use App\Http\Requests\Produk\UpdateProdukRequest;
use App\Http\Resources\ProdukResource;
use App\Models\Produk;
use App\Models\ProdukMart;
use App\Models\Wishlist;
use App\Services\AuditService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ProdukController extends Controller
{
    public function __construct(
        private readonly FileUploadService $fileUploadService
    ) {}

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
            ->when($request->search, fn ($q, $search) => $q->where('nama_produk', 'like', '%'.addcslashes($search, '%_\\').'%'))
            ->when($martId, fn ($q) => $q->with(['produkMarts' => fn ($pm) => $pm->where('mart_id', $martId)]), fn ($q) => $q->with('produkMarts'));

        $produk = $query->latest()->paginate(20);

        $wishlistedIds = $user
            ? Wishlist::where('user_id', $user->id)->pluck('produk_id')->flip()
            : collect();

        $produk->getCollection()->transform(function (Produk $item) use ($wishlistedIds) {
            $item->is_wishlisted = $wishlistedIds->has($item->id);

            return $item;
        });

        return $this->success(
            ProdukResource::collection($produk)->response()->getData(true),
            'Daftar produk berhasil diambil'
        );
    }

    public function show(Request $request, string $id): JsonResponse
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

        $user = $request->user('sanctum');
        $produk->is_wishlisted = $user
            ? Wishlist::where('user_id', $user->id)->where('produk_id', $produk->id)->exists()
            : false;

        return $this->success(ProdukResource::make($produk), 'Detail produk berhasil diambil');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', Produk::class);

        $produk = Produk::query()
            ->with(['kategori:id,nama_kategori', 'produkMarts.mart:id,nama_mart'])
            ->when($request->kategori_id, fn ($q, $id) => $q->where('kategori_id', $id))
            ->when($request->search, fn ($q, $search) => $q->where('nama_produk', 'like', '%'.addcslashes($search, '%_\\').'%'))
            ->latest()
            ->paginate(20);

        return $this->success(
            ProdukResource::collection($produk)->response()->getData(true),
            'Daftar produk admin berhasil diambil'
        );
    }

    public function store(StoreProdukRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $martId = $request->user()->active_mart_id;

        if (! $martId) {
            return $this->error('Mart aktif belum dipilih.', null, 422);
        }

        try {
            $produk = DB::transaction(function () use ($request, $validated, $martId) {
                $gambarPath = null;
                if ($request->hasFile('gambar')) {
                    $gambarPath = $this->fileUploadService->uploadImage($request->file('gambar'), 'produk');
                }

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
        } catch (InvalidArgumentException $e) {
            return $this->error($e->getMessage(), null, 422);
        }

        AuditService::log('product_create', Produk::class, $produk->id, $request);

        return $this->success(ProdukResource::make($produk), 'Produk berhasil ditambahkan', 201);
    }

    public function update(UpdateProdukRequest $request, string $id): JsonResponse
    {
        $produk = Produk::find($id);

        if (! $produk) {
            return $this->error('Produk tidak ditemukan.', null, 404);
        }

        $validated = $request->validated();

        try {
            if ($request->hasFile('gambar')) {
                $this->fileUploadService->delete($produk->gambar);
                $validated['gambar'] = $this->fileUploadService->uploadImage($request->file('gambar'), 'produk');
            }

            $produk->update($validated);
        } catch (InvalidArgumentException $e) {
            return $this->error($e->getMessage(), null, 422);
        }

        AuditService::log('product_update', Produk::class, $produk->id, $request);

        return $this->success(
            ProdukResource::make($produk->fresh()->load(['kategori', 'produkMarts.mart'])),
            'Produk berhasil diperbarui'
        );
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $produk = Produk::find($id);

        if (! $produk) {
            return $this->error('Produk tidak ditemukan.', null, 404);
        }

        $this->authorize('delete', $produk);

        $produk->delete();

        AuditService::log('product_delete', Produk::class, $produk->id, $request);

        return $this->success(null, 'Produk berhasil dihapus');
    }
}
