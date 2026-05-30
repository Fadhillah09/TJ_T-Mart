<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalonTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'nama_galon',
        'harga_satuan',
        'jumlah',
        'total_harga',
        'ongkir',
        'order_id',
        'catatan',
        'status',
        'metode_pembayaran',
        'metode_pengiriman',
        'waktu_transaksi',
    ];

    protected function casts(): array
    {
        return [
            'harga_satuan' => 'decimal:2',
            'total_harga' => 'decimal:2',
            'ongkir' => 'decimal:2',
            'waktu_transaksi' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
