<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('riwayat_pembelian', function (Blueprint $table) {
            $table->decimal('biaya_layanan', 12, 2)->default(0)->after('ongkir');
        });
    }

    public function down(): void
    {
        Schema::table('riwayat_pembelian', function (Blueprint $table) {
            $table->dropColumn('biaya_layanan');
        });
    }
};
