<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KaryawanProfile extends Model
{
    protected $table = 'karyawan_profiles';

    protected $fillable = [
        'user_id', 
        'mart_id', 
        'nip', 
        'gaji_pokok', 
        'status_kerja', 
        'tanggal_masuk'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mart()
    {
        return $this->belongsTo(Mart::class);
    }
}