<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $wishlists = Wishlist::query()
            ->where('user_id', $request->user()->id)
            ->with(['produk' => fn ($q) => $q->withAvg('reviews as avg_rating', 'rating')])
            ->latest()
            ->get();

        return $this->success($wishlists, 'Wishlist berhasil diambil');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'produk_id' => ['required', 'exists:produk,id'],
        ]);

        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('produk_id', $validated['produk_id'])
            ->exists();

        if ($exists) {
            return $this->error('Produk sudah ada di wishlist.', null, 409);
        }

        $produk = Produk::find($validated['produk_id']);
        if (! $produk || ! $produk->is_active) {
            return $this->error('Produk tidak tersedia.', null, 404);
        }

        $wishlist = Wishlist::create([
            'user_id' => $request->user()->id,
            'produk_id' => $validated['produk_id'],
        ]);

        $wishlist->load(['produk' => fn ($q) => $q->withAvg('reviews as avg_rating', 'rating')]);

        return $this->success($wishlist, 'Produk ditambahkan ke wishlist', 201);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)->find($id);

        if (! $wishlist) {
            return $this->error('Wishlist tidak ditemukan.', null, 404);
        }

        $wishlist->delete();

        return $this->success(null, 'Produk dihapus dari wishlist');
    }
}
