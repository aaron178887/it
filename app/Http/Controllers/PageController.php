<?php
declare(strict_types=1);

// app/Http/Controllers/PageController.php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Services\CaptchaService;
use App\Traits\PageTrait;
use App\Traits\ServiceTrait;
use App\Traits\ReferenceTrait;
use App\Http\Requests\Page\PageUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    use PageTrait, ServiceTrait, ReferenceTrait;

    /** Mapování slug → Inertia template. */
    private const TEMPLATES = [
        'kontakt' => 'Contact/Index',
        'o-nas'   => 'About/Index',
    ];

    /**
     * Musí odpovídat route použité v ContactController/CaptchaService pro HMAC podpis.
     * Ideálně sjednotit do configu nebo shared konstanta.
     */
    private const CONTACT_FORM_ROUTE = '/kontakt';

    public function __construct(private CaptchaService $captcha)
    {
        $this->middleware('auth')->only(['dashboard', 'update']);
    }

    /** Zobrazí publikovanou stránku podle slugu, u kontaktní stránky předá i CAPTCHA. */
    public function show(Request $request, string $slug): Response
    {
        $page = Page::query()
            ->select(['id', 'slug', 'data'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $template = self::TEMPLATES[$page->slug] ?? abort(404);

        $props = [
            'page' => [
                'id'   => $page->id,
                'slug' => $page->slug,
                'data' => $page->data ?? [],
            ],
        ];

        if ($page->slug === 'kontakt') {
            $props['captcha'] = $this->captcha->randomQuestionSigned($request, self::CONTACT_FORM_ROUTE);
        }

        return Inertia::render($template, $props);
    }

    /** Admin dashboard – přepínání pohledů podle query parametru `view`. */
    public function dashboard(Request $request): Response
    {
        $view = (string) $request->query('view', 'service');

        // id je pouze číselné → jinak null
        $rawId = $request->query('id');
        $id    = is_numeric($rawId) ? (int) $rawId : null;

        // create/list přes samostatný param
        $mode  = $request->query('mode') === 'create' ? 'create' : 'list';

        $props = match ($view) {
            'service'    => $id ? $this->serviceDetail($id) : $this->listServices(),
            'addService' => ['mode' => 'create'],
            'about'      => $this->getAbout(),
            'contact'    => $this->getContact(),
            'references' => $this->getReference($id, $mode),

            default      => $id ? $this->serviceDetail($id) : $this->listServices(),
        };

        return Inertia::render('Admin/Index', $props);
    }


    /** Uloží obsah vybrané CMS stránky a přesměruje zpět do správného admin pohledu. */
    public function update(PageUpdateRequest $request, string $slug): RedirectResponse
    {
        if (!in_array($slug, ['o-nas', 'kontakt'], true)) {
            abort(404);
        }

        $data    = $request->validated();
        $payload = is_string($data['payload'] ?? null)
            ? (json_decode($data['payload'], true) ?: [])
            : (array)($data['payload'] ?? []);

        $preparedData = $slug === 'o-nas'
            ? $this->prepareAboutData($data, $payload)
            : $this->prepareContactData($data, $payload);

        $processedData = $this->processImages($request, $slug, $preparedData);

        $this->updatePage($slug, $processedData);

        $view = $slug === 'o-nas' ? 'about' : 'contact';

        return redirect()
            ->route('admin.dashboard', ['view' => $view])
            ->with('success', 'Stránka byla uložena.');
    }

    /** Persistuje Page záznam pro daný slug jako publikovaný. */
    private function updatePage(string $slug, array $data): void
    {
        $page = Page::firstOrNew(['slug' => $slug]);
        $page->data = $data;
        $page->is_published = true;
        $page->save();
    }
}
