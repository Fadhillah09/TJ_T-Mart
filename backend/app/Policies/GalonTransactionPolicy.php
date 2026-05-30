<?php

namespace App\Policies;

use App\Models\GalonTransaction;
use App\Models\User;

class GalonTransactionPolicy
{
    public function view(User $user, GalonTransaction $galonTransaction): bool
    {
        if (in_array($user->role?->name, ['admin', 'superadmin'], true)) {
            return true;
        }

        return $user->id === $galonTransaction->user_id;
    }

    public function updateStatus(User $user, GalonTransaction $galonTransaction): bool
    {
        return in_array($user->role?->name, ['admin', 'superadmin'], true);
    }
}
