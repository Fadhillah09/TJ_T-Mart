<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mart extends Model
{
    protected $table = 'mart'; 
    protected $fillable = ['nama_mart', 'alamat', 'deskripsi', 'is_active'];

    // Relasi ke profil karyawan (untuk APK Mobile)
    public function karyawan()
    {
        return $this->hasMany(KaryawanProfile::class, 'mart_id');
    }

    public function produk()
    {
        return $this->belongsToMany(Produk::class, 'produk_mart', 'mart_id', 'produk_id');
    }
}