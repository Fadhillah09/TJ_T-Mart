<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdukVariant extends Model
{
    protected $table = 'produk_variants';

    protected $fillable = [
        'produk_id',
        'nama_varian',
        'harga_tambahan',
        'stok',
    ];

    protected function casts(): array
    {
        return [
            'harga_tambahan' => 'decimal:2',
        ];
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }
}
