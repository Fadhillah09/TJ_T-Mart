<?php

namespace App\Policies;

use App\Models\Produk;
use App\Models\User;

class ProdukPolicy
{
    public function create(User $user): bool
    {
        return in_array($user->role?->name, ['admin', 'superadmin'], true);
    }

    public function update(User $user, Produk $produk): bool
    {
        if ($user->role?->name === 'superadmin') {
            return true;
        }

        if ($user->role?->name !== 'admin') {
            return false;
        }

        return $this->belongsToUserMart($user, $produk);
    }

    public function delete(User $user, Produk $produk): bool
    {
        return $this->update($user, $produk);
    }

    private function belongsToUserMart(User $user, Produk $produk): bool
    {
        $martId = $user->admin?->mart_id ?? $user->active_mart_id;

        if (! $martId) {
            return false;
        }

        return $produk->produkMarts()->where('mart_id', $martId)->exists();
    }
}
