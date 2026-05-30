<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mart extends Model
{
    use SoftDeletes;
    protected $table = 'mart';

    protected $fillable = [
        'nama_mart',
        'alamat',
        'deskripsi',
        'status',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function lokasis(): HasMany
    {
        return $this->hasMany(LokasiDelivery::class, 'mart_id');
    }

    public function admins(): HasMany
    {
        return $this->hasMany(Admin::class);
    }

    public function produkMarts(): HasMany
    {
        return $this->hasMany(ProdukMart::class);
    }

    public function penjualans(): HasMany
    {
        return $this->hasMany(Penjualan::class);
    }

    public function usersWithActiveMart(): HasMany
    {
        return $this->hasMany(User::class, 'active_mart_id');
    }

    public function produks(): BelongsToMany
    {
        return $this->belongsToMany(Produk::class, 'produk_mart')
            ->withPivot(['stok_lokal', 'harga_lokal'])
            ->withTimestamps();
    }
}
