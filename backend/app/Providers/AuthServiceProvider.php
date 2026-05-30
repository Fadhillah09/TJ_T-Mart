<?php

namespace App\Providers;

use App\Models\Absensi;
use App\Models\GalonTransaction;
use App\Models\Produk;
use App\Models\RiwayatPembelian;
use App\Models\User;
use App\Policies\AbsensiPolicy;
use App\Policies\GalonTransactionPolicy;
use App\Policies\ProdukPolicy;
use App\Policies\RiwayatPembelianPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Produk::class => ProdukPolicy::class,
        RiwayatPembelian::class => RiwayatPembelianPolicy::class,
        Absensi::class => AbsensiPolicy::class,
        GalonTransaction::class => GalonTransactionPolicy::class,
    ];

    public function boot(): void
    {
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        Gate::define('create-produk', [ProdukPolicy::class, 'create']);

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('public', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });
    }
}
