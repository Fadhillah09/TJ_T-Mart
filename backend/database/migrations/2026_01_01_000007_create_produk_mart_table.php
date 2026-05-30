<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_mart', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produk_id')->constrained('produk')->cascadeOnDelete();
            $table->foreignId('mart_id')->constrained('mart')->cascadeOnDelete();
            $table->unsignedInteger('stok_lokal')->default(0);
            $table->decimal('harga_lokal', 12, 2)->nullable()->comment('Override harga khusus cabang mart');
            $table->timestamps();

            $table->unique(['produk_id', 'mart_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_mart');
    }
};
