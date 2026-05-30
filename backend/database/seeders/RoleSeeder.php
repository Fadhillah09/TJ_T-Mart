<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'superadmin', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'admin', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'kurir', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'customer', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
