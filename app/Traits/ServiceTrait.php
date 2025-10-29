<?php
declare(strict_types=1);

namespace App\Traits;

use App\Models\Service;
use App\Models\Page;
use App\Helpers\DataHelper;
use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Support\Slug;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

trait ServiceTrait
{
    private const NAV_CACHE_KEY = 'nav.services';
    private const NAV_TTL       = 3600;

    private ?array $navServicesMemo = null;

    /* =========================
     *  FS kolize složky služby
     * ========================= */
    protected function checkServiceDirCollision(string $slug, bool $tolerateEmpty = false): ?string
    {
        $slug = Slug::assert($slug);
        $rel  = "images/services/{$slug}";

        if (!FileHelper::directoryExists($rel)) return null;

        if ($tolerateEmpty) {
            $disk     = Storage::disk('public');
            $hasFiles = count($disk->files($rel)) > 0;
            $hasDirs  = count($disk->directories($rel)) > 0;
            if (!$hasFiles && !$hasDirs) return null;
        }

        return 'Složka pro tento slug již existuje.';
    }

    /* =========================
     *  Public payloady pro FE
     * ========================= */
    public function getServiceForDisplay(Page $page): array
    {
        $data     = $page->data ?? [];
        $service  = $page->service;

        $sections = $this->normalizeSections($data['sections'] ?? []);
        $features = $this->findFeaturesSection($data['sections'] ?? []);

        return [
            'id'            => $service->id ?? null,
            'slug'          => $page->slug,
            'title'         => $data['hero']['title'] ?? '',
            'category'      => $service->category ?? '',
            'menu_icon_svg' => $service->menu_icon_svg ?? null,
            'hero'          => $data['hero'] ?? [],
            'sections'      => $sections,
            'rows'          => DataHelper::blocksToRows($sections),
            'features'      => $features,
            'is_published'  => $page->is_published,
        ];
    }

    public function listServices(): array
    {
        $list = $this->buildServiceList();
        return ['services' => $list, 'mode' => 'list'];
    }

    public function serviceDetail(int|string $id): array
    {
        $list    = $this->buildServiceList();
        $service = Service::with('page')->findOrFail((int) $id);
        $p       = $service->page;

        $hero = (array) data_get($p, 'data.hero', []);
        $servicePayload = [
            'id'            => $p->id,
            'slug'          => $p->slug,
            'title'         => (string) ($hero['title'] ?? $p->slug ?? 'Service'),
            'is_published'  => (bool) $p->is_published,
            'category'      => (string) $service->category,
            'menu_icon_svg' => $service->menu_icon_svg,
            'content'       => [
                'hero' => [
                    'title' => (string) ($hero['title'] ?? ''),
                    'lead'  => (string) ($hero['lead']  ?? ''),
                    'image' => $hero['image'] ?? null,
                ],
                'data' => $p->data ?? [],
            ],
        ];

        return ['services' => $list, 'service' => $servicePayload, 'mode' => 'edit'];
    }

    public function getServicesByCategory(): array
    {
        $services = Service::with('page')
            ->whereHas('page', fn($q) => $q->where('is_published', true))
            ->get()
            ->groupBy('category')
            ->map(function ($services) {
                return $services->map(function ($service) {
                    $p = $service->page;
                    $data     = $p->data ?? [];
                    $hero     = $data['hero'] ?? [];
                    $sections = $data['sections'] ?? [];
                    $features = $this->findFeaturesSection($sections);

                    return [
                        'id'            => $service->id,
                        'slug'          => $p->slug,
                        'title'         => $hero['title'] ?? '',
                        'category'      => $service->category,
                        'menu_icon_svg' => $service->menu_icon_svg,
                        'hero'          => $hero,
                        'features'      => $features,
                    ];
                });
            })
            ->toArray();

        $categoryOrder   = ['Servery', 'Kontejnery', 'Aplikace'];
        $orderedServices = [];

        foreach ($categoryOrder as $cat) {
            if (isset($services[$cat])) $orderedServices[$cat] = $services[$cat];
        }
        foreach ($services as $cat => $items) {
            if (!in_array($cat, $categoryOrder, true)) $orderedServices[$cat] = $items;
        }

        return $orderedServices;
    }

    public function getServicesForNavigation(): array
    {
        if ($this->navServicesMemo !== null) return $this->navServicesMemo;

        $data = Cache::remember(self::NAV_CACHE_KEY, self::NAV_TTL, function () {
            return Service::with(['page:id,slug,data,is_published'])
                ->whereHas('page', fn($q) => $q->where('is_published', true))
                ->orderBy('category')
                ->orderBy('id')
                ->get(['id', 'category', 'menu_icon_svg', 'page_id'])
                ->map(function ($service) {
                    $p = $service->page;
                    return [
                        'id'            => $service->id,
                        'slug'          => $p->slug,
                        'title'         => (string) data_get($p->data, 'hero.title', ''),
                        'category'      => $service->category,
                        'menu_icon_svg' => $service->menu_icon_svg,
                    ];
                })
                ->toArray();
        });

        return $this->navServicesMemo = $data;
    }

    public function findFeaturesSection(array $sections): array
    {
        foreach ($sections as $section) {
            if (($section['type'] ?? '') === 'features') {
                return [
                    'heading' => $section['heading'] ?? 'Výhody',
                    'items'   => $section['items'] ?? [],
                ];
            }
        }
        return ['heading' => null, 'items' => []];
    }

    public function getPublishedCount(): int
    {
        return Service::whereHas('page', fn($q) => $q->where('is_published', true))->count();
    }

    public function getServicesByCategoryName(string $category): array
    {
        return Service::with('page')
            ->where('category', $category)
            ->whereHas('page', fn($q) => $q->where('is_published', true))
            ->get()
            ->map(fn($service) => $this->getServiceForDisplay($service->page))
            ->toArray();
    }

    /* =========================
     *  Build payloads (create/update)
     * ========================= */
    public function processHero(Request $request, string $slug, array $data): array
    {
        $slug = Slug::assert($slug);

        return $this->buildHeroPayload(
            title: $data['hero_title'],
            lead:  $data['hero_lead'],
            request: $request,
            slug: $slug,
            currentHero: null,
            removeFlag: false
        );
    }

    public function processUpdateHero(Request $request, Page $page, string $newSlug, array $data): array
    {
        $newSlug    = Slug::assert($newSlug);
        $current    = ($page->data ?? [])['hero'] ?? [];
        $removeFlag = $request->boolean('remove_hero_image', false);

        return $this->buildHeroPayload(
            title: $data['hero_title'],
            lead:  $data['hero_lead'],
            request: $request,
            slug: $newSlug,
            currentHero: $current,
            removeFlag: $removeFlag
        );
    }

    public function processSections(Request $request, string $slug, array $incomingSections): array
    {
        return $this->mergeSections(
            request: $request,
            slug: $slug,
            incoming: $incomingSections,
            current: []
        );
    }

    public function processUpdateSections(Request $request, Page $page, string $newSlug, array $incomingSections): array
    {
        $current = ($page->data ?? [])['sections'] ?? [];
        return $this->mergeSections(
            request: $request,
            slug: $newSlug,
            incoming: $incomingSections,
            current: $current
        );
    }

    public function processMenuIconSvg(?string $menuIconSvg, ?Service $service = null): ?string
    {
        $raw = $menuIconSvg !== null ? trim($menuIconSvg) : null;
        if ($raw === null || $raw === '') return $service->menu_icon_svg ?? null;

        $sanitized = DataHelper::sanitizeSvg($raw);
        if ($sanitized === '') return $service->menu_icon_svg ?? null;

        return $sanitized;
    }

    protected function buildCreatePayloads(Request $request, array $data): array
    {
        $slug    = Slug::assert($data['slug']);
        $decoded = json_decode($data['data'], true) ?: [];

        $pageData = [
            'slug' => $slug,
            'data' => [
                'hero'     => $this->processHero($request, $slug, $data),
                'sections' => $this->processSections($request, $slug, $decoded['sections'] ?? []),
            ],
            'is_published' => (bool)($data['is_published'] ?? true),
        ];

        $serviceData = [
            'category'      => $data['category'] ?? null,
            'menu_icon_svg' => $this->processMenuIconSvg($data['menu_icon_svg'] ?? null),
        ];

        return [$pageData, $serviceData];
    }

    protected function buildUpdatePayloads(Request $request, Service $service, array $data): array
    {
        $oldSlug = $service->page->slug;
        $newSlug = Slug::assert($data['slug']);

        $decoded = json_decode($data['data'], true) ?: [];

        $pageData = [
            'slug' => $newSlug,
            'data' => [
                'hero'     => $this->processUpdateHero($request, $service->page, $newSlug, $data),
                'sections' => $this->processUpdateSections($request, $service->page, $newSlug, $decoded['sections'] ?? []),
            ],
            'is_published' => (bool)($data['is_published'] ?? $service->page->is_published),
        ];

        if ($newSlug !== $oldSlug) {
            $pageData['data'] = FileHelper::rewriteServiceImagePaths($pageData['data'], $oldSlug, $newSlug);
        }

        $serviceData = [
            'category'      => $data['category'] ?? null,
            'menu_icon_svg' => $this->processMenuIconSvg($data['menu_icon_svg'] ?? null, $service),
        ];

        return [$pageData, $serviceData];
    }

    protected function invalidateServiceNav(): void
    {
        $this->navServicesMemo = null;
        Cache::forget(self::NAV_CACHE_KEY);
    }

    /* =========================
     *  Normalizace sekcí
     * ========================= */
    protected function normalizeSections(array $sections): array
    {
        $normalized = array_map(function ($s) {
            $type  = strtolower((string) ($s['type'] ?? 'split'));
            $title = (string) ($s['title'] ?? '');

            if ($type === 'columns') {
                $colsIn  = is_array($s['columns'] ?? null) ? $s['columns'] : [[], []];
                $columns = array_map(fn ($col) => $this->normalizeColumnToBlocksLocal($col), $colsIn);

                return ['type' => 'columns', 'title' => $title, 'columns' => $columns];
            }

            if ($type === 'features') {
                $itemsRaw = $s['items'] ?? [];
                if (is_string($itemsRaw)) $itemsRaw = json_decode($itemsRaw, true) ?: [];

                $items = [];
                foreach ((array) $itemsRaw as $item) {
                    if (is_array($item)) {
                        $items[] = [
                            'title' => (string) ($item['title'] ?? ''),
                            'text'  => (string) ($item['text'] ?? ''),
                            'icon'  => (string) ($item['icon'] ?? 'bolt'),
                        ];
                    }
                }

                return ['type' => 'features', 'heading' => (string) ($s['heading'] ?? 'Výhody'), 'items' => $items];
            }

            $parasInput    = $s['content'] ?? ($s['paragraphs'] ?? []);
            $contentBlocks = DataHelper::normalizeItemsToBlocks($parasInput);

            $out = ['type' => $type, 'title' => $title, 'content' => $contentBlocks];

            if (($pos = $this->normalizeImagePositionLocal((array)$s)) !== null) $out['imagePosition'] = $pos;
            if (array_key_exists('image', (array)$s)) $out['image'] = $s['image'] ?? null;

            return $out;
        }, $sections);

        return array_values($normalized);
    }

    private function normalizeColumnToBlocksLocal(mixed $col): array
    {
        $isList  = is_array($col) && array_values($col) === $col;
        $content = $isList ? $col : ($col['content'] ?? ($col['paragraphs'] ?? []));
        return DataHelper::normalizeItemsToBlocks($content);
    }

    private function normalizeImagePositionLocal(array $s): ?string
    {
        if (isset($s['imagePosition']) && is_string($s['imagePosition'])) {
            $pos = strtolower($s['imagePosition']);
            if ($pos === 'left' || $pos === 'right') return $pos;
        }
        if (array_key_exists('imgLeft', $s)) return (bool) $s['imgLeft'] ? 'left' : 'right';
        return null;
    }

    private function buildServiceList(): array
    {
        return Service::with(['page:id,slug,data,is_published,updated_at'])
            ->orderByDesc('id')
            ->get(['id', 'category'])
            ->map(function ($s) {
                $p    = $s->page;
                $hero = (array) data_get($p, 'data.hero', []);
                return [
                    'id'           => $s->id,
                    'slug'         => $p?->slug,
                    'title'        => (string) ($hero['title'] ?? $p?->slug ?? 'Service'),
                    'category'     => (string) ($s->category ?? ''),
                    'is_published' => (bool) ($p?->is_published ?? false),
                    'updated_at'   => (string) ($p?->updated_at ?? ''),
                ];
            })
            ->toArray();
    }

    /* =========================
     *  Ochrany obsahu
     * ========================= */
    private function assertNoInlineJsInStructure(mixed $value): void
    {
        if (is_string($value) && DataHelper::containsInlineJs($value)) {
            throw new \InvalidArgumentException('HTML nesmí obsahovat JavaScript (script/on*/javascript:).');
        }
        if (is_array($value)) {
            foreach ($value as $v) $this->assertNoInlineJsInStructure($v);
        }
    }

    /* =========================
     *  HERO
     * ========================= */
    private function buildHeroPayload(
        string $title,
        string $lead,
        Request $request,
        string $slug,
        ?array $currentHero,
        bool $removeFlag
    ): array {
        $hero = [
            'title'  => $title,
            'lead'   => $lead,
            'image'  => $currentHero['image']  ?? null,
            'srcset' => $currentHero['srcset'] ?? null,
        ];

        $baseDir = FileHelper::abs("images/services/{$slug}");

        if ($removeFlag) {
            FileHelper::deleteFilesByPattern($baseDir, 'hero');
            FileHelper::deleteFilesByPattern($baseDir, 'hero-*');
            $hero['image']  = null;
            $hero['srcset'] = null;
            return $hero;
        }

        if ($request->hasFile('hero_image')) {
            FileHelper::deleteFilesByPattern($baseDir, 'hero');
            FileHelper::deleteFilesByPattern($baseDir, 'hero-*');

            $set = ImageHelper::saveHeroImage($request->file('hero_image'), $slug);
            $hero['image']  = $set['src'];
            $hero['srcset'] = $set['sizes'];
            return $hero;
        }

        if ($currentHero === null) {
            $hero['image']  = null;
            $hero['srcset'] = null;
        }

        return $hero;
    }

    private function generateSectionId(): string
    {
        try { return bin2hex(random_bytes(8)); } catch (\Throwable) { return uniqid(); }
    }

    /* =========================
     *  Sekce – tolerantní upload a stabilní ID
     * ========================= */

    /** Vytáhne ID ze src (akceptuje i legacy/UUID s pomlčkami) a normalizuje na [a-z0-9]+. */
    private function extractSectionIdFromImage(?array $img): ?string
    {
        if (!is_array($img)) return null;
        $src = (string) ($img['src'] ?? '');
        if ($src === '') return null;

        if (preg_match('~section-(.+)-\d+\.(?:webp|jpe?g|png|gif|avif)\b~i', $src, $m)) {
            $raw  = strtolower($m[1]);
            $norm = preg_replace('~[^a-z0-9]+~', '', $raw);
            return $norm !== '' ? $norm : null;
        }
        return null;
    }

    /** Normalizace ID na [a-z0-9]{1,32} (bez pomlček). */
    private function normalizeSectionId(string $raw): string
    {
        $id = strtolower(preg_replace('~[^a-z0-9]+~', '', $raw));
        if ($id === '') return $this->generateSectionId();
        return substr($id, 0, 32);
    }

    /** Stabilní výběr ID s ochranou před kolizí po insertu. */
    private function pickSectionId(
        array $incoming,
        ?array $previous,
        int $idx,
        array &$claimed,
        bool $hasUpload
    ): string {
        // 1) FE poslalo ID → zachovat (pokud ještě není zabrané)
        if (!empty($incoming['id']) && is_string($incoming['id'])) {
            $cand = $this->normalizeSectionId($incoming['id']);
            if (!isset($claimed[$cand])) { $claimed[$cand] = true; return $cand; }
        }

        // 2) Nový řádek s uploadem a bez ID → vytvoř nové unikátní ID
        if ($hasUpload) {
            do { $id = $this->generateSectionId(); } while (isset($claimed[$id]));
            $claimed[$id] = true;
            return $id;
        }

        // 3) Reuse předchozí ID (jen když nejsou kandidáti výše)
        if (!empty($previous['id']) && is_string($previous['id'])) {
            $cand = $this->normalizeSectionId($previous['id']);
            if (!isset($claimed[$cand])) { $claimed[$cand] = true; return $cand; }
        }
        if ($exPrev = $this->extractSectionIdFromImage($previous['image'] ?? null)) {
            if (!isset($claimed[$exPrev])) { $claimed[$exPrev] = true; return $exPrev; }
        }

        // 4) Zkus ID z incoming obrázku (např. copy/paste)
        if ($exInc = $this->extractSectionIdFromImage($incoming['image'] ?? null)) {
            if (!isset($claimed[$exInc])) { $claimed[$exInc] = true; return $exInc; }
        }

        // 5) Fallback: nové ID
        do { $id = $this->generateSectionId(); } while (isset($claimed[$id]));
        $claimed[$id] = true;
        return $id;
    }

    /**
     * Striktní výběr souboru: pouze dle ID nebo indexu, bez globálního fallbacku na „první nalezený“.
     * Hlídáme, aby jeden UploadedFile nebyl spárován s více sekcemi v rámci jednoho requestu.
     */
    private function pickSectionFile(
        Request $request,
        int $i,
        ?string $id,
        array &$usedUploads
    ): ?\Illuminate\Http\UploadedFile {
        $files = $request->allFiles();

        $roots = [
            'section_images_by_id', 'sectionImagesById',
            'section_images',       'sectionImages',
            'images',
        ];

        foreach ($roots as $root) {
            $node = data_get($files, $root);
            if (!$node) continue;

            // 1) podle ID
            if ($id) {
                $f = data_get($node, $id);
                if ($f instanceof \Illuminate\Http\UploadedFile) {
                    $h = spl_object_hash($f);
                    if (!isset($usedUploads[$h])) { $usedUploads[$h] = true; return $f; }
                }
            }

            // 2) podle indexu (stringový klíč)
            $f = data_get($node, (string)$i);
            if ($f instanceof \Illuminate\Http\UploadedFile) {
                $h = spl_object_hash($f);
                if (!isset($usedUploads[$h])) { $usedUploads[$h] = true; return $f; }
            }

            // 3) čistě číselný offset
            if (is_array($node) && array_key_exists($i, $node) && $node[$i] instanceof \Illuminate\Http\UploadedFile) {
                $f = $node[$i];
                $h = spl_object_hash($f);
                if (!isset($usedUploads[$h])) { $usedUploads[$h] = true; return $f; }
            }
        }

        return null;
    }

    private function mergeSections(
        Request $request,
        string $slug,
        array $incoming,
        array $current
    ): array {
        $slug = Slug::assert($slug);
        $this->assertNoInlineJsInStructure($incoming);

        $sectionsRel = "images/services/{$slug}";
        $sectionsDir = FileHelper::abs($sectionsRel);
        FileHelper::ensureDirectoryExists($sectionsDir);

        // map existujících sekcí podle stabilního ID (pokud už nějaké je)
        $currentById = [];
        foreach ($current as $c) {
            if (is_array($c) && !empty($c['id']) && is_string($c['id'])) {
                $currentById[$this->normalizeSectionId((string)$c['id'])] = $c;
            }
        }

        $merged      = [];
        $claimed     = []; // v tomto requestu již přidělená ID (anti-kolize po insertu)
        $usedUploads = []; // v tomto requestu již použitá UploadedFile (anti-duplikace)

        foreach ($incoming as $i => $sec) {
            $out = $sec;

            $prevSameIndex = $current[$i] ?? null;

            // Pozor: bez fallbacku – jen ID/index
            $fileGuess = $this->pickSectionFile($request, $i, $sec['id'] ?? null, $usedUploads);

            // Stabilní volba ID
            $id = $this->pickSectionId($sec, $prevSameIndex, $i, $claimed, (bool)$fileGuess);
            $id = $this->normalizeSectionId($id);
            $out['id'] = $id;

            $explicitRemove = array_key_exists('image', $sec) && ($sec['image'] === null);
            $file = $fileGuess;

            if ($file) {
                FileHelper::deleteFilesByPattern($sectionsDir, "section-{$id}-*");

                $baseName = "section-{$id}";

                $set = ImageHelper::saveResponsiveSet(
                    $file,
                    $sectionsRel,
                    $baseName,
                    ImageHelper::SECTION_BREAKPOINTS,
                    ImageHelper::SECTION_MAX_HEIGHT
                );

                $out['image'] = [
                    'src'    => $set['src'],
                    'alt'    => (string)($sec['title'] ?? ''),
                    'srcset' => $set['sizes'],
                ];
            } elseif ($explicitRemove) {
                FileHelper::deleteFilesByPattern($sectionsDir, "section-{$id}-*");
                $out['image'] = null;
            } else {
                // beze změny – zachovat předchozí obrázek (podle ID)
                $prev = $currentById[$id] ?? $prevSameIndex ?? null;

                // fallback: pokud nebyl nalezen záznam podle ID, ale na stejném indexu je starý obrázek s jiným ID,
                // a nové ID jsme zvolili (např. normalizace), přejmenuj soubory a uprav URL
                if (!$prev && ($prevSameIndex && !empty($prevSameIndex['image']))) {
                    $oldId = $this->extractSectionIdFromImage($prevSameIndex['image']);
                    if ($oldId && $oldId !== $id) {
                        foreach (glob($sectionsDir . "/section-{$oldId}-*.*") ?: [] as $old) {
                            $new = str_replace("section-{$oldId}-", "section-{$id}-", $old);
                            @rename($old, $new);
                        }
                        $img = $prevSameIndex['image'];
                        $img['src'] = str_replace("section-{$oldId}-", "section-{$id}-", (string)($img['src'] ?? ''));
                        if (is_array($img['srcset'] ?? null)) {
                            $img['srcset'] = array_map(
                                fn($u) => str_replace("section-{$oldId}-", "section-{$id}-", (string)$u),
                                $img['srcset']
                            );
                        }
                        $out['image'] = $img;
                    } else {
                        $out['image'] = $prevSameIndex['image'] ?? ($out['image'] ?? null);
                    }
                } else {
                    $out['image'] = (is_array($prev) && !empty($prev['image']))
                        ? $prev['image']
                        : ($out['image'] ?? null);
                }
            }

            $merged[] = $out;
        }

        // normalizace (ponecháme IDčka)
        $normalized = $this->normalizeSections($merged);
        foreach ($normalized as $k => &$sec) {
            if (isset($merged[$k]['id'])) {
                $sec['id'] = $this->normalizeSectionId((string)$merged[$k]['id']);
            }
        }
        unset($sec);

        // úklid sirotků (soubory bez existující sekce s daným ID) – tolerantní na legacy názvy
        $usedIds = [];
        foreach ($normalized as $sec) {
            if (!empty($sec['id']) && is_string($sec['id'])) {
                $usedIds[$this->normalizeSectionId($sec['id'])] = true;
            }
            $src = (string) data_get($sec, 'image.src', '');
            if ($src && preg_match('~section-(.+)-\d+\.(?:webp|jpe?g|png|gif|avif)~i', $src, $m)) {
                $usedIds[$this->normalizeSectionId($m[1])] = true;
            }
        }
        $all = glob($sectionsDir . '/section-*-*.*') ?: [];
        foreach ($all as $absPath) {
            $base = basename($absPath);
            if (preg_match('~^section-(.+)-\d+\.(?:webp|jpe?g|png|gif|avif)$~i', $base, $m)) {
                $sid = $this->normalizeSectionId($m[1]);
                if (!isset($usedIds[$sid])) @unlink($absPath);
            }
        }

        return $normalized;
    }
}
