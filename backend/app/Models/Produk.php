<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produk extends Model
{
    use SoftDeletes;

    protected $table = 'produk';

    protected $fillable = [
        'kategori_id',
        'nama_produk',
        'deskripsi',
        'harga',
        'stok',
        'gambar',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'harga' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriProduk::class, 'kategori_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProdukVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProdukReview::class);
    }

    public function produkMarts(): HasMany
    {
        return $this->hasMany(ProdukMart::class);
    }

    public function marts(): BelongsToMany
    {
        return $this->belongsToMany(Mart::class, 'produk_mart')
            ->withPivot(['stok_lokal', 'harga_lokal'])
            ->withTimestamps();
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function detailPembelians(): HasMany
    {
        return $this->hasMany(DetailPembelian::class);
    }

    public function detailPenjualans(): HasMany
    {
        return $this->hasMany(DetailPenjualan::class);
    }
}
