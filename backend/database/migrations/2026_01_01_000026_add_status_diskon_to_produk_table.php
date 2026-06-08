<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->string('status_ketersediaan')->default('Tersedia')->after('is_active');
            $table->unsignedTinyInteger('persentase_diskon')->default(0)->after('status_ketersediaan');
        });
    }

    public function down(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->dropColumn(['status_ketersediaan', 'persentase_diskon']);
        });
    }
};
