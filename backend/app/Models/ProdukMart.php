<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdukMart extends Model
{
    protected $table = 'produk_mart';

    protected $fillable = [
        'produk_id',
        'mart_id',
        'stok_lokal',
        'harga_lokal',
    ];

    protected function casts(): array
    {
        return [
            'harga_lokal' => 'decimal:2',
        ];
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }

    public function mart(): BelongsTo
    {
        return $this->belongsTo(Mart::class);
    }
}
