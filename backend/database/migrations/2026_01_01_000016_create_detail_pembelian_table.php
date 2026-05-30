<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_pembelian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('riwayat_pembelian_id')->constrained('riwayat_pembelian')->cascadeOnDelete();
            $table->foreignId('produk_id')->nullable()->constrained('produk')->nullOnDelete();
            $table->string('nama_produk')->comment('Snapshot nama saat transaksi');
            $table->decimal('harga_satuan', 12, 2);
            $table->unsignedInteger('jumlah');
            $table->decimal('subtotal', 12, 2);
            $table->text('keterangan')->nullable()->comment('Catatan varian / permintaan khusus');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_pembelian');
    }
};
