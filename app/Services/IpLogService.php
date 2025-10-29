<?php

namespace App\Services;

use App\Models\IpLog;
use Illuminate\Support\Carbon;

class IpLogService
{
    /**
     * Zaznamená pokus (request) do tabulky ip_logs.
     */
    public function recordAttempt(
        string $ip,
        string $route,
        ?string $userAgent = null,
        bool $success = false,
        ?string $reason = null
    ): IpLog {
        return IpLog::create([
            'ip'         => $ip,
            'route'      => $route,
            'user_agent' => $userAgent,
            'success'    => $success,
            'reason'     => $reason,
        ]);
    }

    /**
     * Aktualizuje existující záznam (success/reason).
     */
    public function mark(IpLog $attempt, ?bool $success = null, ?string $reason = null): void
    {
        $data = [];
        if ($success !== null) {
            $data['success'] = $success;
        }
        if ($reason !== null) {
            $data['reason'] = $reason;
        }

        if ($data) {
            $attempt->update($data);
        }
    }

    /**
     * Vrátí počet pokusů od daného času.
     */
    public function attemptsSince(string $ip, string $route, Carbon $since): int
    {
        return IpLog::where('ip', $ip)
            ->where('route', $route)
            ->where('created_at', '>=', $since)
            ->count();
    }

    /**
     * Zkontroluje rate limit. Pokud je limit překročen,
     * rovnou zapíše záznam s reason=rate_limit a vrátí ho; jinak vrátí null.
     */
    public function checkRateLimit(
        string $ip,
        string $route,
        ?string $userAgent = null,
        int $maxAttempts = 3,
        ?Carbon $since = null
    ): ?IpLog {
        $since ??= now()->subHour();
        $attempts = $this->attemptsSince($ip, $route, $since);

        if ($attempts >= $maxAttempts) {
            return $this->recordAttempt($ip, $route, $userAgent, false, 'rate_limit');
        }

        return null;
    }
}
