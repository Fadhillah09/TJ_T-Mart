<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mart', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mart');
            $table->text('alamat')->nullable();
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->boolean('is_active')->default(true)->comment('Flag cepat untuk filter UI');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mart');
    }
};
