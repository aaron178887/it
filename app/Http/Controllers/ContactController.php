<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Contact\ContactMessageRequest;
use App\Models\ContactMessage;
use App\Services\IpLogService;
use App\Services\CaptchaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * ContactController
 * - Orchestrace zpracování kontaktů (rate-limit, validace, CAPTCHA, uložení)
 */
class ContactController extends Controller
{
    /** Route použitá v HMAC podpisu CAPTCHA (svázání s konkrétní stránkou/formulářem). */
    private const FORM_ROUTE = '/kontakt';

    public function __construct(
        private IpLogService $ipLog,
        private CaptchaService $captcha
    ) {}

    /**
     * Zpracuje kontaktní zprávu:
     * - rate-limit přes IpLogService
     * - validace přes FormRequest
     * - ověření podpisu a odpovědi CAPTCHA
     * - uložení zprávy + označení pokusu jako OK/FAIL
     */
    public function store(ContactMessageRequest $request): RedirectResponse
    {
        $ip        = (string) $request->ip();
        $route     = self::FORM_ROUTE;
        $userAgent = (string) $request->userAgent();

        if ($this->ipLog->checkRateLimit($ip, $route, $userAgent)) {
            return $this->backWithCaptcha($request, [
                'form' => 'Limit vyčerpán: max 3 pokusy za hodinu.',
            ]);
        }

        $attempt = $this->ipLog->recordAttempt($ip, $route, $userAgent);

        try {
            $validated = $request->validated();
        } catch (ValidationException $e) {
            $this->ipLog->mark($attempt, false, 'validation');
            return $this->backWithCaptcha($request, $e->errors());
        }

        if (!$this->captcha->verifySignature(
            (string)$validated['captcha_qid'],
            (string)$validated['captcha_sig'],
            $request,
            $route
        )) {
            $this->ipLog->mark($attempt, false, 'captcha_sig');
            return $this->backWithCaptcha($request, [
                'form' => 'Bezpečnostní kontrola selhala. Zkuste to prosím znovu.',
            ]);
        }

        if (!$this->captcha->verifyAnswer(
            (string)$validated['captcha_qid'],
            (string)$validated['captcha']
        )) {
            $this->ipLog->mark($attempt, false, 'captcha');
            return $this->backWithCaptcha($request, [
                'captcha' => 'Kontrolní otázka není správně.',
            ]);
        }

        try {
            ContactMessage::create([
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'message'    => $validated['message'],
                'user_agent' => $userAgent,
                'ip_log_id'  => $attempt->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('contact.store failed', [
                'attempt_id' => $attempt->id ?? null,
                'ip'  => $request->ip(),
                'ua'  => $request->userAgent(),
            ]);
            report($e);

            $this->ipLog->mark($attempt, false, 'server');
            return $this->backWithCaptcha($request, [
                'form' => 'Dočasná chyba serveru.',
            ]);
        }

        $this->ipLog->mark($attempt, true, 'ok');

        return back(303)
            ->with('success', 'Děkujeme! Vaše zpráva byla úspěšně odeslána.')
            ->with('captcha', $this->captcha->randomQuestionSigned($request, $route));
    }

    /**
     * Vrátí redirect zpět s chybami a novou podepsanou CAPTCHA.
     * Zachovává pouze pole: name, email, message.
     */
    private function backWithCaptcha(Request $request, array $errors): RedirectResponse
    {
        return back()
            ->withErrors($errors)
            ->onlyInput('name', 'email', 'message')
            ->with('captcha', $this->captcha->randomQuestionSigned($request, self::FORM_ROUTE));
    }
}
