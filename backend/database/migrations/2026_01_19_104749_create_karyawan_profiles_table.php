<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('karyawan_profiles', function (Blueprint $table) {
            $table->id();
            
            // Relasi One-to-One ke tabel users
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // Relasi ke tabel mart untuk mengunci lokasi tugas
            $table->foreignId('mart_id')->nullable()->constrained('mart')->onDelete('set null');

            // Data khusus Dashboard Kurir Mobile
            $table->string('nip')->unique(); 
            $table->decimal('gaji_pokok', 12, 2)->default(0);
            $table->enum('status_kerja', ['aktif', 'cuti', 'nonaktif'])->default('aktif');
            $table->date('tanggal_masuk')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('karyawan_profiles');
    }
};