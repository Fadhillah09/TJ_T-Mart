<?php

namespace App\Policies;

use App\Models\Absensi;
use App\Models\User;

class AbsensiPolicy
{
    public function create(User $user): bool
    {
        return $user->exists;
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role?->name, ['admin', 'superadmin'], true);
    }
}
