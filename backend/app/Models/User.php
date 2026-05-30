<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'password',
        'phone',
        'foto',
        'nomor_kamar',
        'penghuni_asrama',
        'active_mart_id',
        'lokasi_id',
        'status',
        'email_verified_at',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'penghuni_asrama' => 'boolean',
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updated(function (User $user) {
            if ($user->wasChanged('password')) {
                $user->tokens()->delete();
            }
        });
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function activeMart(): BelongsTo
    {
        return $this->belongsTo(Mart::class, 'active_mart_id');
    }

    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(LokasiDelivery::class, 'lokasi_id');
    }

    public function admin(): HasOne
    {
        return $this->hasOne(Admin::class);
    }

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function riwayatPembelians(): HasMany
    {
        return $this->hasMany(RiwayatPembelian::class);
    }

    public function pengantaranSebagaiKurir(): HasMany
    {
        return $this->hasMany(RiwayatPembelian::class, 'kurir_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function absensis(): HasMany
    {
        return $this->hasMany(Absensi::class);
    }

    public function metodePembayarans(): HasMany
    {
        return $this->hasMany(MetodePembayaran::class);
    }

    public function galonTransactions(): HasMany
    {
        return $this->hasMany(GalonTransaction::class);
    }

    public function tokenTransactions(): HasMany
    {
        return $this->hasMany(TokenTransaction::class);
    }

    public function produkReviews(): HasMany
    {
        return $this->hasMany(ProdukReview::class);
    }
}
