<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiwayatPembelian extends Model
{
    use SoftDeletes;

    protected $table = 'riwayat_pembelian';

    protected $fillable = [
        'user_id',
        'kurir_id',
        'order_id',
        'tipe_layanan',
        'status',
        'total',
        'ongkir',
        'biaya_layanan',
        'ongkir_driver',
        'metode_pembayaran',
        'alamat_pengantaran',
        'jarak',
        'durasi',
        'tanggal_pesan',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'ongkir' => 'decimal:2',
            'biaya_layanan' => 'decimal:2',
            'ongkir_driver' => 'decimal:2',
            'jarak' => 'decimal:2',
            'tanggal_pesan' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kurir(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kurir_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(DetailPembelian::class);
    }
}
