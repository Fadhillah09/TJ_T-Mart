<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    // Nama tabel sesuai di database kamu
    protected $table = 'admins';

    protected $fillable = [
        'user_id',
        'mart_id',
        'nama_custom',
        'gaji',
        'jabatan',
        'nama_bank',
        'nomor_rekening',
        'tanggal_gaji'
    ];

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}