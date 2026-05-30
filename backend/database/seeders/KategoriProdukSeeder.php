<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriProdukSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $kategori = [
            'Makanan',
            'Minuman',
            'Alat Tulis',
            'Snack',
            'Perlengkapan Kebersihan',
            'Elektronik',
            'Token Listrik',
            'Galon',
            'Lainnya',
        ];

        $rows = array_map(fn (string $nama) => [
            'nama_kategori' => $nama,
            'created_at' => $now,
            'updated_at' => $now,
        ], $kategori);

        DB::table('kategori_produk')->insert($rows);
    }
}
