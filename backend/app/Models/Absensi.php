<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    protected $table = 'absensis';

    protected $fillable = [
        'user_id',
        'jam_masuk',
        'jam_pulang',
        'status',
        'koordinat_absen',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
