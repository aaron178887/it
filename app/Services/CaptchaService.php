<?php
declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Request;

/**
 * CaptchaService
 * - Generuje podepsané otázky (id, text, sig)
 * - Ověřuje podpis (HMAC: qid|route|ip|ua)
 * - Ověřuje odpověď (číselná, s normalizací mínusu)
 */
class CaptchaService
{
    /** Sada jednoduchých kontrolních otázek s číselnými odpověďmi. */
    private const QUESTIONS = [
        'q1' => ['text' => '2 + pět = ?',   'answer' => 7],
        'q2' => ['text' => '4 + čtyři = ?', 'answer' => 8],
        'q3' => ['text' => '9 − šest = ?',  'answer' => 3],
        'q4' => ['text' => '5 + tři = ?',   'answer' => 8],
        'q5' => ['text' => '16 / dva = ?',  'answer' => 8],
    ];

    /**
     * Náhodně vybere otázku a vrátí {id, text, sig} pro danou route.
     * Podpis je svázán s IP + UA + route.
     */
    public function randomQuestionSigned(Request $request, string $route): array
    {
        $keys = array_keys(self::QUESTIONS);
        $qid  = $keys[random_int(0, count($keys) - 1)];

        return [
            'id'   => $qid,
            'text' => self::QUESTIONS[$qid]['text'],
            'sig'  => $this->sign($qid, (string)$request->ip(), (string)$request->userAgent(), $route),
        ];
    }

    /**
     * Ověří správnost HMAC podpisu (qid|route|ip|ua).
     * Používá hash_equals kvůli timing útokům.
     */
    public function verifySignature(string $qid, string $sig, Request $request, string $route): bool
    {
        $expected = $this->sign($qid, (string)$request->ip(), (string)$request->userAgent(), $route);
        return hash_equals($expected, $sig);
    }

    /**
     * Ověří správnost odpovědi pro zadané qid.
     * Akceptuje pouze čísla; různé znaky mínusu (−,–,—) normalizuje na '-'.
     */
    public function verifyAnswer(string $qid, string $rawAnswer): bool
    {
        $expected = self::QUESTIONS[$qid]['answer'] ?? null;
        if ($expected === null) return false;

        $raw = str_replace(['−', '–', '—'], '-', $rawAnswer);
        if (preg_match('/-?\d+/', $raw, $m) !== 1) return false;

        return (int)$m[0] === (int)$expected;
    }

    /**
     * Vytvoří HMAC podpis pro qid + kontext klienta a route.
     * Data: "qid|route|ip|ua"
     */
    public function sign(string $qid, string $ip, string $ua, string $route): string
    {
        $data = $qid.'|'.$route.'|'.$ip.'|'.$ua;
        return hash_hmac('sha256', $data, $this->hmacKey());
    }

    /**
     * Vrátí binární podobu APP_KEY, pokud je ve formátu base64:..., jinak raw string.
     */
    private function hmacKey(): string
    {
        $key = (string) config('app.key');
        if (str_starts_with($key, 'base64:')) {
            $decoded = base64_decode(substr($key, 7), true);
            if ($decoded !== false) return $decoded;
        }
        return $key;
    }
}
