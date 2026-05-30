<?php

namespace Tests\Feature;

use App\Models\KategoriProduk;
use App\Models\Produk;
use App\Models\ProdukMart;
use App\Models\Role;
use App\Models\User;
use App\Models\Mart;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PolicyAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_cannot_update_product_from_other_mart(): void
    {
        $mart1 = Mart::create(['nama_mart' => 'M1', 'status' => 'aktif', 'is_active' => true]);
        $mart2 = Mart::create(['nama_mart' => 'M2', 'status' => 'aktif', 'is_active' => true]);

        $admin = User::create([
            'role_id' => 2,
            'name' => 'Admin',
            'email' => 'admin2@tjmart.com',
            'password' => Hash::make('Password1a'),
            'status' => 'aktif',
            'email_verified_at' => now(),
            'active_mart_id' => $mart1->id,
        ]);

        $kategori = KategoriProduk::create(['nama_kategori' => 'Snack']);

        $produk = Produk::create([
            'kategori_id' => $kategori->id,
            'nama_produk' => 'Produk Mart 2',
            'harga' => 10000,
            'stok' => 10,
            'is_active' => true,
        ]);

        ProdukMart::create([
            'produk_id' => $produk->id,
            'mart_id' => $mart2->id,
            'stok_lokal' => 10,
        ]);

        Sanctum::actingAs($admin);

        $this->putJson("/api/admin/produk/{$produk->id}", [
            'nama_produk' => 'Hacked',
        ])->assertStatus(403);
    }
}
