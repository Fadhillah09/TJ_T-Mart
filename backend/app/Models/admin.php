<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Admin extends Model
{
    protected $fillable = [
        'user_id',
        'mart_id',
        'jabatan',
        'gaji',
        'nama_bank',
        'nomor_rekening',
        'tanggal_gaji',
    ];

    protected function casts(): array
    {
        return [
            'gaji' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mart(): BelongsTo
    {
        return $this->belongsTo(Mart::class);
    }

    public function penjualans(): HasMany
    {
        return $this->hasMany(Penjualan::class);
    }
}
