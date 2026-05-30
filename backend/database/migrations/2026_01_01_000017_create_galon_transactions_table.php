<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galon_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('nama_galon');
            $table->decimal('harga_satuan', 12, 2);
            $table->unsignedInteger('jumlah')->default(1);
            $table->decimal('total_harga', 12, 2);
            $table->decimal('ongkir', 12, 2)->default(0);
            $table->string('order_id')->unique();
            $table->text('catatan')->nullable();
            $table->enum('status', ['menunggu', 'diproses', 'dikirim', 'selesai', 'dibatalkan'])->default('menunggu');
            $table->enum('metode_pembayaran', ['tunai', 'transfer', 'qris', 'ewallet'])->default('tunai');
            $table->enum('metode_pengiriman', ['antar', 'pickup'])->default('antar');
            $table->timestamp('waktu_transaksi')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galon_transactions');
    }
};
