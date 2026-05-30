<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->restrictOnDelete();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable()->comment('Nomor telepon / WhatsApp');
            $table->string('foto')->nullable()->comment('Path foto profil');
            $table->string('nomor_kamar', 10)->nullable()->comment('Nomor kamar asrama penghuni');
            $table->boolean('penghuni_asrama')->default(false)->comment('true jika penghuni asrama kampus');
            $table->foreignId('active_mart_id')
                ->nullable()
                ->index()
                ->comment('Mart yang sedang aktif dipilih user — FK ditambahkan setelah tabel mart ada');
            $table->foreignId('lokasi_id')
                ->nullable()
                ->index()
                ->comment('Lokasi pengantaran default — FK ditambahkan setelah tabel lokasi_delivery ada');
            $table->enum('status', ['aktif', 'nonaktif', 'suspended'])->default('aktif');
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
