<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Page;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $svgServer = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="2" y="2" width="20" height="8" rx="2"/>
  <rect x="2" y="14" width="20" height="8" rx="2"/>
  <line x1="6" y1="6"  x2="6.01" y2="6"/>
  <line x1="6" y1="18" x2="6.01" y2="18"/>
</svg>
SVG;

        $svgShield = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/>
</svg>
SVG;

        $svgK8s = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polygon points="12 2 22 8 18 20 6 20 2 8 12 2"/>
  <circle cx="12" cy="12" r="3"/>
</svg>
SVG;

        $svgPipe = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
  <path d="M15 6a3 3 0 0 1-3 3H6"/>
</svg>
SVG;

        $svgApp = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/>
  <rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>
</svg>
SVG;

        $svgCode = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
</svg>
SVG;

        $svgMove = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M20.39 18.39A9 9 0 1 0 3 12h1.26"/>
</svg>
SVG;

        // Seznam služeb s jejich specifickými atributy
        $services = [
            'vps' => [
                'page_slug' => 'vps',
                'category' => 'Servery',
                'svg' => $svgServer,
            ],
            'spravovane-servery' => [
                'page_slug' => 'spravovane-servery',
                'category' => 'Servery',
                'svg' => $svgShield,
            ],
            'kubernetes' => [
                'page_slug' => 'kubernetes',
                'category' => 'Kontejnery',
                'svg' => $svgK8s,
            ],
            'ci-cd-pipeliny' => [
                'page_slug' => 'ci-cd-pipeliny',
                'category' => 'Kontejnery',
                'svg' => $svgPipe,
            ],
            'firemni-aplikace' => [
                'page_slug' => 'firemni-aplikace',
                'category' => 'Aplikace',
                'svg' => $svgApp,
            ],
            'zakazkovy-vyvoj' => [
                'page_slug' => 'zakazkovy-vyvoj',
                'category' => 'Aplikace',
                'svg' => $svgCode,
            ],
            'migrace' => [
                'page_slug' => 'migrace',
                'category' => 'Aplikace',
                'svg' => $svgMove,
            ],
        ];

        // Vytvoření služeb - používají stejné ID jako pages
        foreach ($services as $serviceData) {
            $page = Page::where('slug', $serviceData['page_slug'])->first();

            if ($page) {
                Service::updateOrCreate(
                    ['id' => $page->id], // stejné ID jako page
                    [
                        'category'      => $serviceData['category'],
                        'menu_icon_svg' => $serviceData['svg'],
                    ]
                );
            } else {
                $this->command->warn("Stránka se sluhem '{$serviceData['page_slug']}' nebyla nalezena. Služba nebyla vytvořena.");
            }
        }

        $this->command->info('Services byly úspěšně naplněny s identifikační závislostí na Pages.');
        $this->command->info('Počet vytvořených/aktualizovaných služeb: ' . count($services));
    }
}
