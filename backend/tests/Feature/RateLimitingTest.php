<?php

namespace Tests\Feature;

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        RateLimiter::clear('auth:127.0.0.1');
    }

    public function test_auth_routes_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', [
                'email' => 'missing@tjmart.com',
                'password' => 'wrong',
            ]);
        }

        $response = $this->postJson('/api/auth/login', [
            'email' => 'missing@tjmart.com',
            'password' => 'wrong',
        ]);

        $response->assertStatus(429);
    }
}
