<?php
// app/Http/Middleware/HandleInertiaRequests.php
declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Str;
use App\Models\Service;
use App\Models\Page;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * Hlavní Blade view pro první načtení Inertia aplikace.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Sdílená data pro všechny Inertia odpovědi.
     */
    public function share(Request $request): array
    {
        // ---- navServices: spojíme services s published pages ----
        $navServices = Cache::remember('nav.services', 3600, function () {
            $rows = Service::query()
                ->with(['page' => function ($query) {
                    $query->where('is_published', 1);
                }])
                ->whereHas('page', function ($query) {
                    $query->where('is_published', 1);
                })
                ->get(['services.id', 'services.category', 'services.menu_icon_svg']);

            $grouped = $rows->groupBy(function ($s) {
                $name = trim((string)($s->category ?? 'Ostatní'));
                return $name === '' ? 'Ostatní' : $name;
            });

            $services = $grouped->map(function ($items, $catName) {
                return [
                    'slug'  => Str::slug($catName) ?: 'ostatni',
                    'name'  => $catName,
                    'items' => $items->map(function ($s) {
                        if (is_null($s->page)) return null;

                        $pageData = $s->page->data ?? [];
                        $hero     = $pageData['hero'] ?? [];

                        $title = $hero['title'] ?? 'Služba';

                        return [
                            'title'         => $title,
                            'slug'          => $s->page->slug,
                            'href'          => "/sluzby/{$s->page->slug}",
                            'menu_icon_svg' => $s->menu_icon_svg ?? null,
                        ];
                    })->filter()->values()->all(),
                ];
            })->values();

            $order = ['servery', 'kontejnery', 'aplikace'];

            return $services->sortBy(function ($g) use ($order) {
                $i = array_search(strtolower($g['slug']), $order, true);
                return $i === false ? 999 : $i;
            })->values()->all();
        });

        // ---- site: firemní kontakty z CMS stránky "kontakt" (pro Header, Footer, atd.) ----
        $site = Cache::remember('site.contact', 3600, function () {
            $page = Page::query()
                ->where('slug', 'kontakt')
                ->where('is_published', 1)
                ->select('data')
                ->first();

            $d        = (array)($page->data ?? []);
            $company  = (array)($d['company']  ?? []);
            $contacts = (array)($d['contacts'] ?? []);

            return [
                'company'  => [
                    'name' => $company['name'] ?? null,
                    'ic'   => $company['ic']   ?? null,
                    'dic'  => $company['dic']  ?? null,
                    'registry' => $company['registry'] ?? null,
                ],
                'contacts' => [
                    'phone'   => $contacts['phone']   ?? null,
                    'email'   => $contacts['email']   ?? null,
                    'address' => $contacts['address'] ?? null,
                    'note'    => $contacts['note']    ?? null,
                ],
                'map' => (array)($d['map'] ?? []),
            ];
        });

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => Auth::user()
                    ? [
                        'id'    => Auth::user()->id,
                        'name'  => Auth::user()->name,
                        'email' => Auth::user()->email,
                    ]
                    : null,
            ],
            'flash'       => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'navServices' => $navServices,
            'site'        => $site,
        ]);
    }
}
