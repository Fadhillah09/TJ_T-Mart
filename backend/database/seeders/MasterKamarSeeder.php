<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterKamarSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [];

        foreach (range(101, 110) as $nomor) {
            $rows[] = ['lantai' => 1, 'nomor_kamar' => (string) $nomor];
        }

        foreach (range(201, 220) as $nomor) {
            $rows[] = ['lantai' => 2, 'nomor_kamar' => (string) $nomor];
        }

        foreach (range(301, 320) as $nomor) {
            $rows[] = ['lantai' => 3, 'nomor_kamar' => (string) $nomor];
        }

        foreach (range(401, 420) as $nomor) {
            $rows[] = ['lantai' => 4, 'nomor_kamar' => (string) $nomor];
        }

        DB::table('master_kamars')->insert($rows);
    }
}
