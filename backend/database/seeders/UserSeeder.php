<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $password = Hash::make('password');

        DB::table('users')->insert([
            [
                'id' => 1,
                'role_id' => 1,
                'name' => 'Superadmin',
                'email' => 'superadmin@tjmart.com',
                'password' => $password,
                'phone' => null,
                'foto' => null,
                'nomor_kamar' => null,
                'penghuni_asrama' => false,
                'active_mart_id' => null,
                'lokasi_id' => null,
                'status' => 'aktif',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'role_id' => 2,
                'name' => 'Admin Putra',
                'email' => 'admin@tjmart.com',
                'password' => $password,
                'phone' => null,
                'foto' => null,
                'nomor_kamar' => null,
                'penghuni_asrama' => false,
                'active_mart_id' => 1,
                'lokasi_id' => null,
                'status' => 'aktif',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'role_id' => 3,
                'name' => 'Kurir',
                'email' => 'kurir@tjmart.com',
                'password' => $password,
                'phone' => null,
                'foto' => null,
                'nomor_kamar' => null,
                'penghuni_asrama' => false,
                'active_mart_id' => 1,
                'lokasi_id' => null,
                'status' => 'aktif',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'role_id' => 4,
                'name' => 'Customer Test',
                'email' => 'customer@tjmart.com',
                'password' => $password,
                'phone' => null,
                'foto' => null,
                'nomor_kamar' => null,
                'penghuni_asrama' => false,
                'active_mart_id' => null,
                'lokasi_id' => null,
                'status' => 'aktif',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
