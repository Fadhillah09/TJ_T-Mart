<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mart_id')->nullable()->constrained('mart')->nullOnDelete();
            $table->string('jabatan')->nullable();
            $table->decimal('gaji', 12, 2)->default(0);
            $table->string('nama_bank')->nullable();
            $table->string('nomor_rekening')->nullable();
            $table->unsignedTinyInteger('tanggal_gaji')->nullable()->comment('Tanggal gajian per bulan (1–31)');
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
