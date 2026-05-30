<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'role_id' => $this->role_id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'phone' => $this->phone,
            'foto' => $this->foto,
            'nomor_kamar' => $this->nomor_kamar,
            'penghuni_asrama' => $this->penghuni_asrama,
            'active_mart_id' => $this->active_mart_id,
            'lokasi_id' => $this->lokasi_id,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at,
            'role' => $this->whenLoaded('role'),
            'active_mart' => $this->whenLoaded('activeMart'),
            'lokasi' => $this->whenLoaded('lokasi'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
