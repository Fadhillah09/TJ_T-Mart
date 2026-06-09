<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdukResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kategori_id' => $this->kategori_id,
            'nama_produk' => $this->nama_produk,
            'deskripsi' => $this->deskripsi,
            'harga' => $this->harga,
            'stok' => $this->stok,
            'gambar' => $this->gambar,
            'gambar_url' => $this->gambar ? asset('storage/'.$this->gambar) : null,
            'is_active' => $this->is_active,
            'status_ketersediaan' => $this->status_ketersediaan,
            'persentase_diskon' => $this->persentase_diskon,
            'avg_rating' => $this->when(isset($this->avg_rating), round((float) $this->avg_rating, 2)),
            'total_reviews' => $this->when(isset($this->total_reviews), (int) $this->total_reviews),
            'is_wishlisted' => $this->when(isset($this->is_wishlisted), (bool) $this->is_wishlisted),
            'produk_marts' => $this->relationLoaded('produkMarts') 
            ? $this->produkMarts->map(function ($pm) {
                return [
                    'id' => $pm->id,
                    'produk_id' => $pm->produk_id,
                    'mart_id' => $pm->mart_id,
                    'stok_lokal' => $pm->stok_lokal,
                    'harga_lokal' => $pm->harga_lokal,
                    'mart' => $pm->relationLoaded('mart') && $pm->mart ? [
                        'id' => $pm->mart->id,
                        'nama_mart' => $pm->mart->nama_mart,
                        'alamat' => $pm->mart->alamat,
                    ] : null,
                ];
            })
            : [],
            'kategori' => $this->whenLoaded('kategori'),
            'variants' => $this->whenLoaded('variants'),
            'reviews' => $this->whenLoaded('reviews'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
