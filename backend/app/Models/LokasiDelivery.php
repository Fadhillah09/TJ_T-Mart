<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LokasiDelivery extends Model
{
    protected $table = 'lokasi_delivery';

    protected $fillable = [
        'mart_id',
        'nama_lokasi',
        'nama_gedung',
        'latitude',
        'longitude',
        'foto',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function mart(): BelongsTo
    {
        return $this->belongsTo(Mart::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'lokasi_id');
    }
}
