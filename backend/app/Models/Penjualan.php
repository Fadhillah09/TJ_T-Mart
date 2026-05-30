<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penjualan extends Model
{
    protected $table = 'penjualan';

    protected $fillable = [
        'admin_id',
        'mart_id',
        'total',
        'tanggal_penjualan',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'tanggal_penjualan' => 'date',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    public function mart(): BelongsTo
    {
        return $this->belongsTo(Mart::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(DetailPenjualan::class);
    }
}
