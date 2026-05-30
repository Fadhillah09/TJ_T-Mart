<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbsensiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'jam_masuk' => $this->jam_masuk,
            'jam_pulang' => $this->jam_pulang,
            'status' => $this->status,
            'status_label' => match ($this->status) {
                'tepat_waktu' => 'Tepat Waktu',
                'terlambat' => 'Terlambat',
                'mangkir' => 'Mangkir',
                default => null,
            },
            'koordinat_absen' => $this->koordinat_absen,
            'user' => UserResource::make($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
