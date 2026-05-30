<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalHarga = $this->whenLoaded('items', function () {
            return $this->items->sum(fn ($item) => $item->quantity * (float) ($item->produk->harga ?? 0));
        }, 0);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total_harga' => $totalHarga,
        ];
    }
}
