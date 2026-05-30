<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetailPembelianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'riwayat_pembelian_id' => $this->riwayat_pembelian_id,
            'produk_id' => $this->produk_id,
            'nama_produk' => $this->nama_produk,
            'harga_satuan' => $this->harga_satuan,
            'jumlah' => $this->jumlah,
            'subtotal' => $this->subtotal,
            'keterangan' => $this->keterangan,
            'produk' => ProdukResource::make($this->whenLoaded('produk')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
