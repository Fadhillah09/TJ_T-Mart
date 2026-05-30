<?php

namespace App\Policies;

use App\Models\RiwayatPembelian;
use App\Models\User;

class RiwayatPembelianPolicy
{
    public function view(User $user, RiwayatPembelian $riwayatPembelian): bool
    {
        if (in_array($user->role?->name, ['admin', 'superadmin'], true)) {
            return true;
        }

        return $user->id === $riwayatPembelian->user_id;
    }

    public function updateStatus(User $user, RiwayatPembelian $riwayatPembelian): bool
    {
        return in_array($user->role?->name, ['admin', 'superadmin'], true);
    }
}
