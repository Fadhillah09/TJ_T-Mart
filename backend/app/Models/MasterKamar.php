<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterKamar extends Model
{
    protected $table = 'master_kamars';

    public $timestamps = false;

    protected $fillable = [
        'lantai',
        'nomor_kamar',
    ];
}
