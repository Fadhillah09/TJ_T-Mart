<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPembelian extends Model
{
    protected $table = 'detail_pembelian';

    protected $fillable = [
        'riwayat_pembelian_id',
        'produk_id',
        'nama_produk',
        'harga_satuan',
        'jumlah',
        'subtotal',
        'keterangan',
    ];

    protected function casts(): array
    {
        return [
            'harga_satuan' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function riwayatPembelian(): BelongsTo
    {
        return $this->belongsTo(RiwayatPembelian::class);
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }
}
