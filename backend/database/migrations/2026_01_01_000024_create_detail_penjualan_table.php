<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_penjualan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penjualan_id')->constrained('penjualan')->cascadeOnDelete();
            $table->foreignId('produk_id')->constrained('produk')->restrictOnDelete();
            $table->unsignedInteger('jumlah');
            $table->decimal('harga_satuan', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });

        DB::statement('DROP VIEW IF EXISTS produk_laris');
        DB::statement('DROP VIEW IF EXISTS penjualan_tahunan');
        DB::statement('DROP VIEW IF EXISTS penjualan_bulanan');

        DB::statement('
            CREATE VIEW penjualan_bulanan AS
            SELECT
                mart_id,
                YEAR(tanggal_penjualan) AS tahun,
                MONTH(tanggal_penjualan) AS bulan,
                COUNT(*) AS jumlah_transaksi,
                SUM(total) AS total_penjualan
            FROM penjualan
            GROUP BY mart_id, YEAR(tanggal_penjualan), MONTH(tanggal_penjualan)
        ');

        DB::statement('
            CREATE VIEW penjualan_tahunan AS
            SELECT
                mart_id,
                YEAR(tanggal_penjualan) AS tahun,
                COUNT(*) AS jumlah_transaksi,
                SUM(total) AS total_penjualan
            FROM penjualan
            GROUP BY mart_id, YEAR(tanggal_penjualan)
        ');

        DB::statement('
            CREATE VIEW produk_laris AS
            SELECT
                dp.produk_id,
                p.nama_produk,
                pj.mart_id,
                SUM(dp.jumlah) AS total_terjual,
                SUM(dp.subtotal) AS total_pendapatan
            FROM detail_penjualan dp
            INNER JOIN penjualan pj ON pj.id = dp.penjualan_id
            INNER JOIN produk p ON p.id = dp.produk_id
            GROUP BY dp.produk_id, p.nama_produk, pj.mart_id
            ORDER BY total_terjual DESC
        ');
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS produk_laris');
        DB::statement('DROP VIEW IF EXISTS penjualan_tahunan');
        DB::statement('DROP VIEW IF EXISTS penjualan_bulanan');

        Schema::dropIfExists('detail_penjualan');
    }
};
