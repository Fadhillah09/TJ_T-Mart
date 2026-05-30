<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riwayat_pembelian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('kurir_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('order_id')->unique()->comment('Kode pesanan unik untuk pelacakan');
            $table->enum('tipe_layanan', ['pickup', 'delivery'])->default('delivery');
            $table->enum('status', [
                'pending',
                'processing',
                'delivering',
                'completed',
                'cancelled',
            ])->default('pending');
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('ongkir', 12, 2)->default(0);
            $table->decimal('ongkir_driver', 12, 2)->default(0)->comment('Bagian ongkir untuk kurir');
            $table->enum('metode_pembayaran', ['COD', 'MIDTRANS'])->default('COD');
            $table->text('alamat_pengantaran')->nullable();
            $table->decimal('jarak', 8, 2)->nullable()->comment('Jarak pengantaran dalam km');
            $table->unsignedInteger('durasi')->nullable()->comment('Estimasi durasi pengantaran dalam menit');
            $table->timestamp('tanggal_pesan')->useCurrent();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_pembelian');
    }
};
