<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Produk;
use App\Models\ProdukMart;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $cart->load(['items.produk:id,nama_produk,harga,gambar,is_active']);

        return $this->success(CartResource::make($cart), 'Keranjang berhasil diambil');
    }

    public function store(StoreCartItemRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $produk = Produk::find($validated['produk_id']);

        if (! $produk || ! $produk->is_active) {
            return $this->error('Produk tidak tersedia.', null, 404);
        }

        $availableStok = $this->availableStok($user, $produk);

        if ($availableStok < $validated['quantity']) {
            return $this->error('Stok produk tidak mencukupi.', ['stok' => $availableStok], 422);
        }

        $cart = $this->getOrCreateCart($user->id);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('produk_id', $validated['produk_id'])
            ->first();

        $newQty = $validated['quantity'];

        if ($item) {
            $newQty = $item->quantity + $validated['quantity'];
            if ($availableStok < $newQty) {
                return $this->error('Stok produk tidak mencukupi.', ['stok' => $availableStok], 422);
            }
            $item->update(['quantity' => $newQty]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'produk_id' => $validated['produk_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        $cart->load(['items.produk:id,nama_produk,harga,gambar,is_active']);

        return $this->success(CartResource::make($cart), 'Produk ditambahkan ke keranjang', 201);
    }

    public function update(UpdateCartItemRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();
        $cart = $this->getOrCreateCart($user->id);

        $item = CartItem::where('cart_id', $cart->id)->where('id', $id)->first();

        if (! $item) {
            return $this->error('Item keranjang tidak ditemukan.', null, 404);
        }

        $produk = Produk::find($item->produk_id);
        $availableStok = $this->availableStok($user, $produk);

        if ($availableStok < $validated['quantity']) {
            return $this->error('Stok produk tidak mencukupi.', ['stok' => $availableStok], 422);
        }

        $item->update(['quantity' => $validated['quantity']]);

        $cart->load(['items.produk:id,nama_produk,harga,gambar,is_active']);

        return $this->success(CartResource::make($cart), 'Keranjang berhasil diperbarui');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);

        $item = CartItem::where('cart_id', $cart->id)->where('id', $id)->first();

        if (! $item) {
            return $this->error('Item keranjang tidak ditemukan.', null, 404);
        }

        $item->delete();

        $cart->load(['items.produk:id,nama_produk,harga,gambar,is_active']);

        return $this->success(CartResource::make($cart), 'Item dihapus dari keranjang');
    }

    private function getOrCreateCart(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    private function availableStok(User $user, Produk $produk): int
    {
        if ($user->active_mart_id) {
            $produkMart = ProdukMart::where('produk_id', $produk->id)
                ->where('mart_id', $user->active_mart_id)
                ->first();

            if ($produkMart) {
                return (int) $produkMart->stok_lokal;
            }
        }

        return (int) $produk->stok;
    }
}
