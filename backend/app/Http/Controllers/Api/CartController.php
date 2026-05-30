<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $cart->load(['items.produk:id,nama_produk,harga,gambar']);

        return $this->success($this->formatCart($cart), 'Keranjang berhasil diambil');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'produk_id' => ['required', 'exists:produk,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $produk = Produk::find($validated['produk_id']);

        if (! $produk || ! $produk->is_active) {
            return $this->error('Produk tidak tersedia.', null, 404);
        }

        if ($produk->stok < $validated['quantity']) {
            return $this->error('Stok produk tidak mencukupi.', ['stok' => $produk->stok], 422);
        }

        $cart = $this->getOrCreateCart($request->user()->id);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('produk_id', $validated['produk_id'])
            ->first();

        $newQty = $validated['quantity'];

        if ($item) {
            $newQty = $item->quantity + $validated['quantity'];
            if ($produk->stok < $newQty) {
                return $this->error('Stok produk tidak mencukupi.', ['stok' => $produk->stok], 422);
            }
            $item->update(['quantity' => $newQty]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'produk_id' => $validated['produk_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        $cart->load(['items.produk:id,nama_produk,harga,gambar']);

        return $this->success($this->formatCart($cart), 'Produk ditambahkan ke keranjang', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->getOrCreateCart($request->user()->id);

        $item = CartItem::where('cart_id', $cart->id)->where('id', $id)->first();

        if (! $item) {
            return $this->error('Item keranjang tidak ditemukan.', null, 404);
        }

        $produk = Produk::find($item->produk_id);

        if ($produk->stok < $validated['quantity']) {
            return $this->error('Stok produk tidak mencukupi.', ['stok' => $produk->stok], 422);
        }

        $item->update(['quantity' => $validated['quantity']]);

        $cart->load(['items.produk:id,nama_produk,harga,gambar']);

        return $this->success($this->formatCart($cart), 'Keranjang berhasil diperbarui');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);

        $item = CartItem::where('cart_id', $cart->id)->where('id', $id)->first();

        if (! $item) {
            return $this->error('Item keranjang tidak ditemukan.', null, 404);
        }

        $item->delete();

        $cart->load(['items.produk:id,nama_produk,harga,gambar']);

        return $this->success($this->formatCart($cart), 'Item dihapus dari keranjang');
    }

    private function getOrCreateCart(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    private function formatCart(Cart $cart): array
    {
        $totalHarga = $cart->items->sum(fn (CartItem $item) => $item->quantity * (float) $item->produk->harga);

        return [
            'id' => $cart->id,
            'user_id' => $cart->user_id,
            'items' => $cart->items,
            'total_harga' => $totalHarga,
        ];
    }
}
