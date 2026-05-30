<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'produk_id' => $this->produk_id,
            'quantity' => $this->quantity,
            'produk' => ProdukResource::make($this->whenLoaded('produk')),
        ];
    }
}
