<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presensi extends Model
{
    protected $fillable = ['user_id', 'mart_id', 'tanggal', 'jam_masuk', 'jam_keluar', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}