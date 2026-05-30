<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'no_telp',
        'penghuni_asrama',
        'lokasi_id',      
        'alamat_gedung',
        'nomor_kamar',     
        'gambar',
        'remember_token',
        'email_verified_at',
        'mart_id', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function karyawanProfile()
    {
        return $this->hasOne(KaryawanProfile::class, 'user_id', 'id');
    }

    public function isKurir()
    {
        return $this->role && $this->role->role_name === 'Kurir';
    }

    public function isSuperAdmin()
    {
        return $this->role && $this->role->role_name === 'Super Admin';
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    public function lokasi()
    {
        return $this->belongsTo(LokasiDelivery::class, 'lokasi_id', 'id');
    }

    public function getAlamatLengkapAttribute()
    {
        $gedung = $this->lokasi ? $this->lokasi->nama_lokasi : ($this->alamat_gedung ?? 'Gedung belum diset');
        $kamar = $this->nomor_kamar ? "Kamar " . $this->nomor_kamar : 'Kamar belum diset';
        
        return "{$gedung} - {$kamar}";
    }

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function mart()
    {
        return $this->belongsTo(Mart::class, 'mart_id');
    }
}