<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MartSeeder::class,
            LokasiDeliverySeeder::class,
            KategoriProdukSeeder::class,
            MasterKamarSeeder::class,
            UserSeeder::class,
            AdminSeeder::class,
            ProdukSeeder::class,
        ]);
    }
}
