<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalonTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'nama_galon' => $this->nama_galon,
            'harga_satuan' => $this->harga_satuan,
            'jumlah' => $this->jumlah,
            'total_harga' => $this->total_harga,
            'ongkir' => $this->ongkir,
            'order_id' => $this->order_id,
            'catatan' => $this->catatan,
            'status' => $this->status,
            'metode_pembayaran' => $this->metode_pembayaran,
            'metode_pengiriman' => $this->metode_pengiriman,
            'waktu_transaksi' => $this->waktu_transaksi,
            'user' => UserResource::make($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
