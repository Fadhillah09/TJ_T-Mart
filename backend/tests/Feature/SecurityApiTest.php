<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_login_validation_requires_email_and_password(): void
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_account_lockout_after_five_failed_attempts(): void
    {
        Cache::flush();

        User::create([
            'email' => 'lock@tjmart.com',
            'password' => Hash::make('correct-password'),
            'role_id' => 4,
            'name' => 'Lock Test',
            'email_verified_at' => now(),
            'status' => 'aktif',
        ]);

        $service = app(\App\Services\LoginSecurityService::class);
        $ip = '127.0.0.1';

        for ($i = 0; $i < 5; $i++) {
            $service->recordFailedAttempt('lock@tjmart.com', $ip);
        }

        $this->assertTrue($service->isLocked('lock@tjmart.com', $ip));

        $response = $this->postJson('/api/auth/login', [
            'email' => 'lock@tjmart.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(429)
            ->assertJsonPath('message', 'Akun terkunci sementara, coba lagi dalam 15 menit');
    }

    public function test_unverified_user_cannot_access_protected_routes(): void
    {
        $user = User::create([
            'role_id' => 4,
            'name' => 'Unverified',
            'email' => 'unverified@tjmart.com',
            'password' => Hash::make('Password1a'),
            'status' => 'aktif',
            'email_verified_at' => null,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/cart')->assertStatus(403);
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = $this->createVerifiedCustomer();

        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->withToken($token)
            ->getJson('/api/cart')
            ->assertUnauthorized();
    }

    public function test_logout_all_revokes_all_tokens(): void
    {
        $user = $this->createVerifiedCustomer();

        $token1 = $user->createToken('t1')->plainTextToken;
        $user->createToken('t2');

        $this->withToken($token1)
            ->postJson('/api/auth/logout-all')
            ->assertOk();

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_register_password_must_meet_complexity_rules(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'weak@tjmart.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(422);
    }

    public function test_security_headers_are_present(): void
    {
        $response = $this->get('/up');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
    }

    public function test_cors_allows_configured_origin(): void
    {
        config(['cors.allowed_origins' => ['http://localhost:5173']]);

        $response = $this->options('/api/auth/login', [], [
            'Origin' => 'http://localhost:5173',
            'Access-Control-Request-Method' => 'POST',
        ]);

        $response->assertSuccessful();
    }

    private function createVerifiedCustomer(): User
    {
        return User::create([
            'role_id' => 4,
            'name' => 'Customer',
            'email' => 'verified@tjmart.com',
            'password' => Hash::make('Password1a'),
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
    }
}
