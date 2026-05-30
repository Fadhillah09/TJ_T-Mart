<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('admins')->insert([
            [
                'user_id' => 2,
                'mart_id' => 1,
                'jabatan' => 'Admin Mart',
                'gaji' => 2500000,
                'nama_bank' => 'BCA',
                'nomor_rekening' => '32441565',
                'tanggal_gaji' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'user_id' => 3,
                'mart_id' => 1,
                'jabatan' => 'Kurir',
                'gaji' => 1500000,
                'nama_bank' => 'Mandiri',
                'nomor_rekening' => '6566851524',
                'tanggal_gaji' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
