<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lokasi_delivery', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mart_id')->constrained('mart')->cascadeOnDelete();
            $table->string('nama_lokasi');
            $table->string('nama_gedung')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('foto')->nullable()->comment('Path foto gedung / titik lokasi');
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('active_mart_id')
                ->references('id')
                ->on('mart')
                ->nullOnDelete();
            $table->foreign('lokasi_id')
                ->references('id')
                ->on('lokasi_delivery')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['active_mart_id']);
            $table->dropForeign(['lokasi_id']);
        });

        Schema::dropIfExists('lokasi_delivery');
    }
};
