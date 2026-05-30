<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MartSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('mart')->insert([
            [
                'id' => 1,
                'nama_mart' => 'TJ Mart Putra',
                'status' => 'aktif',
                'alamat' => 'Belakang Gedung 1 Asrama Putra, dekat Sport Center, Universitas Telkom Bandung',
                'deskripsi' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'nama_mart' => 'T Mart Putra',
                'status' => 'aktif',
                'alamat' => 'Depan Gedung 8 Asrama Putra, dekat Mushola Kantin Asrama, Universitas Telkom Bandung',
                'deskripsi' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'nama_mart' => 'TJ Mart Putri',
                'status' => 'aktif',
                'alamat' => 'Belakang Gedung A Asrama Putri Universitas Telkom Bandung',
                'deskripsi' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
