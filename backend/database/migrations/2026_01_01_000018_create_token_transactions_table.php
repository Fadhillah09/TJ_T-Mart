<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('token_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->decimal('nominal', 12, 2);
            $table->string('nomor_token')->unique()->comment('Kode token listrik yang dihasilkan sistem');
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'dibatalkan'])->default('menunggu');
            $table->enum('metode_pembayaran', ['tunai', 'transfer', 'qris', 'ewallet'])->default('tunai');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('token_transactions');
    }
};
