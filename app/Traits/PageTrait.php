<?php

namespace App\Traits;

use App\Models\Page;
use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Helpers\DataHelper; // <- přidáno
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

trait PageTrait
{
    private function getAbout(): array
    {
        $page = Page::where('slug', 'o-nas')->firstOrFail();
        $db   = $page->data ?? [];
        $hero = (array) data_get($db, 'hero', []);

        $payload = [
            'hero' => [
                'title'    => (string) data_get($hero, 'title', ''),
                'subtitle' => (string) data_get($hero, 'subtitle', ''),
                'image'    => data_get($hero, 'image'),
                'counters' => (array)  data_get($hero, 'counters', []),
            ],
            'about' => [
                'title' => (string) data_get($db, 'about.title', ''),
                'text'  => (string) data_get($db, 'about.text', ''),
                'image' => [
                    'src' => (string) data_get($db, 'about.image.src', ''),
                    'alt' => (string) data_get($db, 'about.image.alt', ''),
                ],
            ],
            'infrastructure' => [
                'lead'   => (string) data_get($db, 'infrastructure.lead', ''),
                'blocks' => $this->prepareInfrastructureBlocks((array) data_get($db, 'infrastructure.blocks', [])),
            ],
            'gallery' => Collection::make((array) data_get($db, 'gallery', []))
                ->map(fn ($g) => [
                    'title' => (string) data_get($g, 'title', ''),
                    'alt'   => (string) data_get($g, 'alt', ''),
                    'src'   => (string) data_get($g, 'src', ''),
                ])
                ->values()
                ->all(),
        ];

        return [
            'about' => [
                'id'        => $page->id,
                'slug'      => 'o-nas',
                'title'     => $payload['hero']['title'] ?: 'About Us',
                'published' => (bool) $page->is_published,
                'content'   => [
                    'hero' => $payload['hero'],
                    'data' => $payload,
                ],
            ],
        ];
    }

    private function getContact(): array
    {
        $page = Page::where('slug', 'kontakt')->firstOrFail();
        $db   = $page->data ?? [];
        $hero = (array) data_get($db, 'hero', []);

        // --- map: sanitizace + fallback z adresy
        $address = (string) data_get($db, 'contacts.address', '');
        $rawEmbed = (string) data_get($db, 'map.embed', '');
        $rawLink  = (string) data_get($db, 'map.link', '');

        $embed = DataHelper::sanitizeGoogleMapsEmbedUrl($rawEmbed, true);
        $link  = DataHelper::sanitizeGoogleMapsEmbedUrl($rawLink);

        if ($embed === '' && $address !== '') {
            $embed = DataHelper::buildGoogleMapsEmbedFromAddress($address);
        }
        if ($link === '' && $address !== '') {
            $link = 'https://www.google.com/maps/search/' . rawurlencode($address);
        }

        $payload = [
            'hero' => [
                'title'    => (string) data_get($hero, 'title', ''),
                'subtitle' => (string) data_get($hero, 'subtitle', ''),
                'image'    => data_get($hero, 'image'),
            ],
            'company' => [
                'name'     => (string) data_get($db, 'company.name', ''),
                'ic'       => (string) data_get($db, 'company.ic', ''),
                'dic'      => (string) data_get($db, 'company.dic', ''),
                'registry' => (string) data_get($db, 'company.registry', ''),
            ],
            'contacts' => [
                'note'    => (string) data_get($db, 'contacts.note', ''),
                'address' => $address,
                'email'   => (string) data_get($db, 'contacts.email', ''),
                'phone'   => (string) data_get($db, 'contacts.phone', ''),
            ],
            'map' => [
                'embed' => $embed,
                'link'  => $link,
            ],
        ];

        return [
            'contact' => [
                'id'        => $page->id,
                'slug'      => 'kontakt',
                'title'     => $payload['hero']['title'] ?: 'Contact',
                'published' => (bool) $page->is_published,
                'content'   => [
                    'hero' => $payload['hero'],
                    'data' => $payload,
                ],
            ],
        ];
    }

    /* =========================================================
     *  UI → DB (WRITE) – `prepare*` (ukládáme PLOCHÁ data)
     * ========================================================= */

    public function prepareAboutData(array $data, array $payload): array
    {
        return [
            'hero' => [
                'title'    => (string) $data['hero_title'],
                'subtitle' => (string) $data['hero_subtitle'],
                'image'    => data_get($payload, 'hero.image'),
                'counters' => $this->prepareCounters((array) data_get($payload, 'hero.counters', [])),
            ],
            'about' => [
                'title' => (string) data_get($payload, 'data.about.title', ''),
                'text'  => (string) data_get($payload, 'data.about.text', ''),
                'image' => [
                    'src' => (string) data_get($payload, 'data.about.image.src', ''),
                    'alt' => (string) data_get($payload, 'data.about.image.alt', ''),
                ],
            ],
            'infrastructure' => [
                'lead'   => (string) data_get($payload, 'data.infrastructure.lead', ''),
                'blocks' => $this->prepareInfrastructureBlocks((array) data_get($payload, 'data.infrastructure.blocks', [])),
            ],
            'gallery' => $this->prepareGalleryFromPayload((array) data_get($payload, 'data.gallery', [])),
        ];
    }

    public function prepareContactData(array $data, array $payload): array
    {
        // 1) Vytáhneme “plochá” data
        $address = (string) data_get($payload, 'data.contacts.address', '');

        // 2) Vstupní URL (může být prázdné / nevalidní)
        $embedIn = (string) data_get($payload, 'data.map.embed', '');
        $linkIn  = (string) data_get($payload, 'data.map.link', '');

        // 3) Sanitizace + fallbacky z adresy
        $embed = DataHelper::sanitizeGoogleMapsEmbedUrl($embedIn, true);
        if ($embed === '' && $address !== '') {
            // když admin nic nevloží, vyrobíme embed z adresy
            $embed = DataHelper::buildGoogleMapsEmbedFromAddress($address, 'cs-CZ', 12);
        }

        // tu samou sanitizační funkci můžeš použít i na "link" – propustí i ne-embed /maps URL
        $link = DataHelper::sanitizeGoogleMapsEmbedUrl($linkIn);
        if ($link === '' && $address !== '') {
            // jednoduchý safe link na vyhledání adresy
            $link = 'https://www.google.com/maps/search/' . rawurlencode($address) . '/?hl=cs-CZ';
        }

        return [
            'hero' => [
                'title'    => (string) $data['hero_title'],
                'subtitle' => (string) $data['hero_subtitle'],
                'image'    => data_get($payload, 'hero.image'),
            ],
            'company' => [
                'name'     => (string) data_get($payload, 'data.company.name', ''),
                'ic'       => (string) data_get($payload, 'data.company.ic', ''),
                'dic'      => (string) data_get($payload, 'data.company.dic', ''),
                'registry' => (string) data_get($payload, 'data.company.registry', ''),
            ],
            'contacts' => [
                'note'    => (string) data_get($payload, 'data.contacts.note', ''),
                'address' => $address,
                'email'   => (string) data_get($payload, 'data.contacts.email', ''),
                'phone'   => (string) data_get($payload, 'data.contacts.phone', ''),
            ],
            'map' => [
                'embed' => $embed,
                'link'  => $link,
            ],
        ];
    }

    /* =========================================================
     *  HELPERS (uploads, transforms) – PLOCHÁ STRUKTURA
     * ========================================================= */

    public function processImages(Request $request, string $slug, array $saveData): array
    {
        $baseDir = FileHelper::abs("images/pages/{$slug}");

        // HERO: smaž hero.* i hero-*.* a ulož set do kořene
        if ($request->hasFile('hero_image')) {
            FileHelper::deleteFilesByPattern($baseDir, 'hero');
            FileHelper::deleteFilesByPattern($baseDir, 'hero-*');

            /** @var UploadedFile $file */
            $file = $request->file('hero_image');
            $set  = ImageHelper::saveHeroImageForPage($file, $slug);
            $saveData['hero']['image'] = $set['src'];
        }

        // ABOUT (jen 'o-nas'): about.webp v kořeni
        if ($slug === 'o-nas' && $request->hasFile('about_image')) {
            FileHelper::deleteFilesByPattern($baseDir, 'about');

            /** @var UploadedFile $file */
            $file   = $request->file('about_image');
            $result = ImageHelper::saveAboutImage($file, $slug);
            $saveData['about']['image']['src'] = $result['url'];
        }

        // GALLERY (jen 'o-nas'): g{index}.webp a g{index}-thumb.webp v kořeni
        if ($slug === 'o-nas') {
            foreach ((array) $request->file('gallery_images', []) as $i => $file) {
                if ($file instanceof UploadedFile) {
                    FileHelper::deleteFilesByPattern($baseDir, "g{$i}");
                    FileHelper::deleteFilesByPattern($baseDir, "g{$i}-thumb");

                    $img   = ImageHelper::saveGalleryImage($file, $slug, $i);
                    $thumb = ImageHelper::saveGalleryThumbnail($file, $slug, $i);

                    $title = (string) data_get($saveData, "gallery.{$i}.title", '');
                    $alt   = (string) data_get($saveData, "gallery.{$i}.alt",   '');

                    $saveData['gallery'][$i] = [
                        'title' => $title,
                        'alt'   => $alt,
                        'src'   => $img['url'],
                        // 'thumb' => $thumb['url'],
                    ];
                }
            }
            $saveData['gallery'] = array_values($saveData['gallery'] ?? []);
        }

        return $saveData;
    }

    private function prepareCounters(array $counters): array
    {
        return Collection::make($counters)
            ->map(fn ($c) => [
                'label' => (string) data_get($c, 'label', ''),
                'value' => (string) data_get($c, 'value', ''),
            ])
            ->values()
            ->all();
    }

    private function prepareInfrastructureBlocks(array $blocks): array
    {
        return Collection::make($blocks)
            ->map(function ($b) {
                $items = Collection::make((array) data_get($b, 'items', []))
                    ->map(fn ($it) => [
                        'badge' => (string) data_get($it, 'badge', ''),
                        'text'  => (string) data_get($it, 'text', ''),
                    ])->values()->all();

                return [
                    'title' => (string) data_get($b, 'title', ''),
                    'items' => $items,
                ];
            })->values()->all();
    }

    private function prepareGalleryFromPayload(array $gallery): array
    {
        return Collection::make($gallery)
            ->map(fn ($g) => [
                'title' => (string) data_get($g, 'title', ''),
                'alt'   => (string) data_get($g, 'alt', ''),
                'src'   => (string) data_get($g, 'src', ''),
            ])
            ->filter(fn ($g) => $g['src'] !== '')
            ->values()
            ->slice(0, 4)
            ->all();
    }
}
