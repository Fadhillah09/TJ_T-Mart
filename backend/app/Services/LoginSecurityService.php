<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class LoginSecurityService
{
    private const MAX_ATTEMPTS = 5;

    private const LOCK_MINUTES = 15;

    public function isLocked(string $email, string $ip): bool
    {
        return Cache::has($this->lockKey($email, $ip));
    }

    public function recordFailedAttempt(string $email, string $ip): void
    {
        $attemptKey = $this->attemptKey($email, $ip);
        $attempts = (int) Cache::get($attemptKey, 0) + 1;

        Cache::put($attemptKey, $attempts, now()->addMinutes(self::LOCK_MINUTES));

        if ($attempts >= self::MAX_ATTEMPTS) {
            Cache::put($this->lockKey($email, $ip), true, now()->addMinutes(self::LOCK_MINUTES));
        }
    }

    public function clearAttempts(string $email, string $ip): void
    {
        Cache::forget($this->attemptKey($email, $ip));
        Cache::forget($this->lockKey($email, $ip));
    }

    private function attemptKey(string $email, string $ip): string
    {
        return 'login_attempts:'.hash('sha256', $email.':'.$ip);
    }

    private function lockKey(string $email, string $ip): string
    {
        return 'login_lock:'.hash('sha256', $email.':'.$ip);
    }
}
