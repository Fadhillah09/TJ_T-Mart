<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_kamars', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('lantai');
            $table->string('nomor_kamar', 10);

            $table->unique(['lantai', 'nomor_kamar']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_kamars');
    }
};
