<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SecurityCheckCommand extends Command
{
    protected $signature = 'security:check';

    protected $description = 'Run production security configuration checks';

    public function handle(): int
    {
        $this->info('TJ-T-Mart Security Audit');
        $this->newLine();

        $checks = [
            'APP_DEBUG disabled in production' => $this->checkAppDebug(),
            'APP_KEY exists' => $this->checkAppKey(),
            'DB_PASSWORD configured' => $this->checkDbPassword(),
            'SANCTUM_STATEFUL_DOMAINS configured' => $this->checkSanctumDomains(),
            'BCRYPT_ROUNDS >= 12' => $this->checkBcryptRounds(),
        ];

        $failed = 0;

        foreach ($checks as $label => $passed) {
            if ($passed) {
                $this->line("<fg=green>PASS</> {$label}");
            } else {
                $this->line("<fg=red>FAIL</> {$label}");
                $failed++;
            }
        }

        $this->newLine();

        if ($failed > 0) {
            $this->error("{$failed} check(s) failed.");

            return self::FAILURE;
        }

        $this->info('All security checks passed.');

        return self::SUCCESS;
    }

    private function checkAppDebug(): bool
    {
        if (! app()->environment('production')) {
            return true;
        }

        return config('app.debug') === false;
    }

    private function checkAppKey(): bool
    {
        return filled(config('app.key'));
    }

    private function checkDbPassword(): bool
    {
        if (config('database.default') === 'sqlite') {
            return true;
        }

        return filled(config('database.connections.mysql.password'));
    }

    private function checkSanctumDomains(): bool
    {
        return filled(env('SANCTUM_STATEFUL_DOMAINS'));
    }

    private function checkBcryptRounds(): bool
    {
        return (int) config('hashing.bcrypt.rounds', 12) >= 12;
    }
}
