<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;           
use App\Models\Mart;          
use App\Models\User;           
use App\Models\KaryawanProfile;
use Illuminate\Support\Facades\Hash;

class KaryawanSeeder extends Seeder
{
    public function run(): void
    {
        // Buat Roles (Urutan Hierarki)
        $roleAdmin      = Role::create(['role_name' => 'Super Admin']); // ID 1
        $roleManagement = Role::create(['role_name' => 'Management']);  // ID 2
        $roleKurir      = Role::create(['role_name' => 'Kurir']);       // ID 3
        $rolePembeli    = Role::create(['role_name' => 'Pembeli']);     // ID 4

        $mart = Mart::create([
            'nama_mart' => 'T-Mart Putri',
            'alamat' => 'Gedung Asrama Putri',
            'is_active' => true
        ]);

        // Akun Pembeli (User Biasa - Role ID 4)
        User::create([
            'name' => 'Budi Pembeli',
            'email' => 'budi@gmail.com',
            'password' => Hash::make('password123'),
            'role_id' => $rolePembeli->id,
            'penghuni_asrama' => 'ya',
            'alamat_gedung' => 'Gedung C',
            'nomor_kamar' => '304'
        ]);

        // (Karyawan - Role ID 3)
        $userKurir = User::create([
            'name' => 'Agus Kurir',
            'email' => 'agus@tjtmart.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleKurir->id,
        ]);

        // (Hanya untuk Agus si Kurir)
        KaryawanProfile::create([
            'user_id' => $userKurir->id,
            'mart_id' => $mart->id,
            'nip' => 'KRR-001',
            'gaji_pokok' => 2500000,
            'status_kerja' => 'aktif'
        ]);
    }
}