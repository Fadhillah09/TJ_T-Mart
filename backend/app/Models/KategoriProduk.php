<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class KategoriProduk extends Model
{
    use SoftDeletes;
    protected $table = 'kategori_produk';

    protected $fillable = [
        'nama_kategori',
    ];

    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class, 'kategori_id');
    }
}
