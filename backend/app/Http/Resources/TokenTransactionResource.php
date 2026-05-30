<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TokenTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'nominal' => $this->nominal,
            'nomor_token' => $this->nomor_token,
            'status' => $this->status,
            'metode_pembayaran' => $this->metode_pembayaran,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
