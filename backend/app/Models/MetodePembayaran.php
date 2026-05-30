<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetodePembayaran extends Model
{
    protected $table = 'metode_pembayaran';

    protected $fillable = [
        'user_id',
        'kategori',
        'bank',
        'norek',
        'telepon',
        'keterangan',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
