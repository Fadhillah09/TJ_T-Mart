<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RiwayatPembelianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'kurir_id' => $this->kurir_id,
            'order_id' => $this->order_id,
            'tipe_layanan' => $this->tipe_layanan,
            'status' => $this->status,
            'total' => $this->total,
            'ongkir' => $this->ongkir,
            'biaya_layanan' => $this->biaya_layanan,
            'ongkir_driver' => $this->ongkir_driver,
            'metode_pembayaran' => $this->metode_pembayaran,
            'alamat_pengantaran' => $this->alamat_pengantaran,
            'jarak' => $this->jarak,
            'durasi' => $this->durasi,
            'tanggal_pesan' => $this->tanggal_pesan,
            'user' => UserResource::make($this->whenLoaded('user')),
            'kurir' => UserResource::make($this->whenLoaded('kurir')),
            'details' => DetailPembelianResource::collection($this->whenLoaded('details')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
