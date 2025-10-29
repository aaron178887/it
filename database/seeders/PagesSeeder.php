<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PagesSeeder extends Seeder
{
    public function run(): void
    {
        // Statické stránky (bez služeb) – FLAT struktura dat, cesty přes /storage/...
        $staticPages = [
            'kontakt' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title'    => 'Máte dotaz nebo zpětnou vazbu?',
                        'subtitle' => 'Neváhejte nás kontaktovat – jsme tu pro vás 24/7 a rádi pomůžeme se vším, co se týká vašeho hostingu nebo cloudu.',
                        'image'    => '/storage/images/pages/kontakt/hero.jpg',
                    ],
                    'company' => [
                        'name'     => 'IT Globe s.r.o. (OpenVPS)',
                        'ic'       => '14117215',
                        'dic'      => '',
                        'registry' => 'Krajský soud v Hradci Králové, oddíl C, vložka 48710',
                    ],
                    'contacts' => [
                        'note'    => 'K dispozici 24/7',
                        'address' => 'Orlické Podhůří 30, 562 01 Ústí nad Orlicí',
                        'email'   => 'info@openvps.cz',
                        'phone'   => '+420 733 482 481',
                    ],
                    'map' => [
                        'embed' => 'https://www.google.com/maps?q=Orlick%C3%A9+Podh%C5%AF%C5%99%C3%AD+30,+562+01+%C3%9Ast%C3%AD+nad+Orlic%C3%AD&hl=cs-CZ&z=12&output=embed',
                        'link'  => 'https://www.google.com/maps/search/Orlick%C3%A9+Podh%C5%AF%C5%99%C3%AD+30,+562+01+%C3%9Ast%C3%AD+nad+Orlic%C3%AD/@49.999437,16.358034,12z?hl=cs-CZ&entry=ttu',
                    ],
                ],
            ],
            'o-nas' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title'    => 'Naše mise',
                        'subtitle' => 'Ulevujeme firmám od starostí s informačními technologiemi, aby se mohly v klidu věnovat své práci.',
                        'image'    => '/storage/images/pages/o-nas/hero.jpg', // string, ne objekt
                        'counters' => [
                            ['label' => 'Působíme na českém trhu', 'value' => '21 let'],
                            ['label' => 'Spokojených zákazníků',    'value' => '300+'],
                            ['label' => 'SLA dostupnost',           'value' => '99,9 %'],
                        ],
                    ],
                    'about' => [
                        'title' => 'O nás',
                        'text'  => "Dodáváme spolehlivé hostingové a cloudové služby, které vám uvolní ruce pro vaše podnikání. Stavíme infrastrukturu na míru, přebíráme správu serverů a dohlížíme na provoz 24/7 s důrazem na bezpečnost a vysokou dostupnost.\n\nNabízíme VPS a spravované servery, kontejnery a Kubernetes, CI/CD pipeline, migrace i vývoj firemních aplikací. Využíváme ověřený enterprise hardware (Dell/HP), redundantní konektivitu a zálohy do druhé lokality.",
                        'image' => [
                            'src' => '/storage/images/pages/o-nas/about.jpg',
                            'alt' => 'IT Globe – o nás',
                        ],
                    ],
                    'infrastructure' => [
                        'lead'   => 'Vlastní racky v datacentru Tier III+, trojí konektivita a dohled 24/7. Servery Dell & HP, úložiště HP 3PAR, zálohy do druhé lokality.',
                        'blocks' => [
                            [
                                'title' => 'Konfigurace serverů',
                                'items' => [
                                    ['badge' => 'Virtualizace', 'text' => 'KVM + Proxmox'],
                                    ['badge' => 'Servery',      'text' => 'Dell R740 & HP DL380 Gen10'],
                                    ['badge' => 'Procesory',    'text' => 'AMD EPYC / Intel Xeon (Silver/Gold)'],
                                    ['badge' => 'Paměť',        'text' => 'ECC DDR4 až 1 TB na uzel'],
                                    ['badge' => 'Disky',        'text' => 'NVMe + SSD enterprise řady'],
                                    ['badge' => 'Zálohování',   'text' => 'Duplicity + vzdálená lokalita (Brno)'],
                                ],
                            ],
                            [
                                'title' => 'Síť & dohled',
                                'items' => [
                                    ['badge' => 'Konektivita',   'text' => 'Redundantní uplinky, BGP, DDoS ochrana'],
                                    ['badge' => 'Dohled',        'text' => '24/7 monitoring a on-call'],
                                    ['badge' => 'Firewall',      'text' => 'FortiGate / pfSense cluster'],
                                    ['badge' => 'Load-balancing','text' => 'HAProxy + keepalived (L4/L7)'],
                                    ['badge' => 'IPv4/IPv6',     'text' => 'Vlastní AS, peering, transit'],
                                    ['badge' => 'Síťové prvky',  'text' => 'Cisco / Juniper, dual PSU'],
                                ],
                            ],
                        ],
                    ],
                    'gallery' => [
                        [
                            'title' => 'O nás – obrázek 1',
                            'alt'   => 'Tým při práci v kanceláři',
                            'src'   => '/storage/images/pages/o-nas/about_gallery1.jpg',
                        ],
                        [
                            'title' => 'O nás – obrázek 2',
                            'alt'   => 'Datové centrum – racky',
                            'src'   => '/storage/images/pages/o-nas/about_gallery2.jpg',
                        ],
                        [
                            'title' => 'O nás – obrázek 3',
                            'alt'   => 'Síťové prvky a kabeláž',
                            'src'   => '/storage/images/pages/o-nas/about_gallery3.jpg',
                        ],
                        [
                            'title' => 'O nás – obrázek 4',
                            'alt'   => 'Serverová infrastruktura detail',
                            'src'   => '/storage/images/pages/o-nas/about_gallery4.jpg',
                        ],
                    ],
                ],
            ],
        ];

        // Stránky pro služby (1:1 vztah) – cesty přes /storage/...
        $servicePages = [
            'vps' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'VPS server',
                        'lead'  => 'Vyladěný a bezpečný hosting pro vaše aplikace a projekty.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'  => 'split',
                            'title' => 'VPS server',
                            'content' => [
                                ['html' => '<h2>Výkonný VPS hosting</h2>
                                    <p><b>Rychlé a spolehlivé</b> virtuální servery pro vaše projekty a aplikace.</p>
                                    <ul>
                                      <li>Root přístup</li>
                                      <li>Moderní CPU a rychlá RAM</li>
                                      <li>NVMe úložiště a snapshoty</li>
                                    </ul>'],
                                ['html' => '<p>Díky vysoké dostupnosti se hodí pro <a href="/reference">weby i aplikace</a>.</p>'],
                            ],
                            'image' => ['src' => '/storage/images/services/intro.jpg', 'alt' => 'Ilustrace VPS / rack'],
                            'imagePosition' => 'right',
                        ],
                        [
                            'type'  => 'text',
                            'title' => 'Proč naše VPS',
                            'content' => [
                                ['html' => '<h3>Co získáte</h3>
                                    <ol>
                                      <li>Transparentní ceny</li>
                                      <li>Možnost správy jako služba</li>
                                      <li>Non-stop dohled a podpora</li>
                                    </ol>'],
                                ['html' => '<p>Aktualizace, zálohy a monitoring můžete nechat <b>na nás</b>.</p>'],
                            ],
                        ],
                        [
                            'type'   => 'columns',
                            'title'  => 'Konfigurace na míru',
                            'columns'=> [
                                ['content' => [
                                    ['html' => '<h3>Dohled a údržba</h3><p>Počet vCPU a RAM dle zátěže.</p><ul><li>AMD/Intel</li><li>DDR4/DDR5</li></ul>'],
                                    ['html' => '<p>Vertikální i horizontální škálování.</p>'],
                                ]],
                                ['content' => [
                                    ['html' => '<h3>Managed služby</h3><p>Veřejné i privátní sítě.</p><ul><li>NVMe</li><li>Zálohy</li></ul>'],
                                    ['html' => '<p>Možnost <a href="/kontakt">managed</a> služeb a SLA.</p>'],
                                ]],
                            ],
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'VPS bez kompromisů',
                            'items'   => array_fill(0, 8, [
                                'title' => 'Špičkový výkon',
                                'text'  => 'Zaručený špičkový výkon díky procesorům AMD Ryzen/Intel Xeon a rychlým pamětem DDR4.',
                                'icon'  => 'bolt',
                            ]),
                        ],
                    ],
                ],
            ],
            'spravovane-servery' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'Spravované servery',
                        'lead'  => 'Přenechte administraci na nás – bezpečnost, aktualizace a dohled 24/7.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'  => 'split',
                            'title' => 'Bez starostí',
                            'content' => [
                                ['html' => '<p>Instalace, zálohy, patchování i incidenty – jsme váš ops tým.</p>'],
                                ['html' => '<p>Garance SLA a best-practice zabezpečení.</p>'],
                            ],
                            'image' => ['src' => '/storage/images/services/ops.jpg', 'alt' => 'Operations tým'],
                            'imagePosition' => 'left',
                        ],
                        [
                            'type'    => 'columns',
                            'title'   => 'Co zahrnujeme',
                            'columns' => [
                                ['content' => [
                                    ['html' => '<ul><li>Hardening</li><li>Monitoring</li><li>Alerting</li></ul>'],
                                ]],
                                ['content' => [
                                    ['html' => '<ul><li>Incident response</li><li>Reporty</li><li>Poradenství</li></ul>'],
                                ]],
                            ],
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'Správa bez kompromisů',
                            'items'   => [
                                ['title' => 'Nonstop dohled', 'text' => 'Monitoring a reakce 24/7.', 'icon' => 'bolt'],
                            ],
                        ],
                    ],
                ],
            ],
            'kubernetes' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'Kubernetes',
                        'lead'  => 'Produkční orchestrace kontejnerů.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'  => 'split',
                            'title' => 'Cluster na míru',
                            'content' => [
                                ['html' => '<p>Návrh, provoz a správa K8s včetně CI/CD.</p>'],
                                ['html' => '<p>Bezpečnost, observabilita a škálování jsou samozřejmost.</p>'],
                            ],
                            'image' => ['src' => '/storage/images/services/k8s.jpg', 'alt' => 'Kubernetes'],
                            'imagePosition' => 'right',
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'Cloud-native výhody',
                            'items'   => [
                                ['title' => 'Škálování', 'text' => 'Auto/Horizontal pod autoscaler.', 'icon' => 'scale'],
                                ['title' => 'Observabilita', 'text' => 'Logy, metriky, tracing.', 'icon' => 'bolt'],
                            ],
                        ],
                    ],
                ],
            ],
            'ci-cd-pipeliny' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'CI/CD pipeliny',
                        'lead'  => 'Automatizace buildů, testů a nasazování.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'  => 'split',
                            'title' => 'Rychleji do produkce',
                            'content' => [
                                ['html' => '<p>GitLab CI, GitHub Actions, ArgoCD – navrhneme a zavedeme.</p>'],
                                ['html' => '<p>Standardizace, kvalita, auditovatelnost.</p>'],
                            ],
                            'image' => ['src' => '/storage/images/services/cicd.jpg', 'alt' => 'CI/CD'],
                            'imagePosition' => 'left',
                        ],
                        [
                            'type'  => 'text',
                            'title' => 'Kvalita',
                            'content' => [
                                ['html' => '<p>Testy a code-quality přímo v pipeline.</p>'],
                            ],
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'Automatizace',
                            'items'   => [
                                ['title' => 'Kvalita', 'text' => 'Testy, linty, SAST/DAST.', 'icon' => 'bolt'],
                            ],
                        ],
                    ],
                ],
            ],
            'firemni-aplikace' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'Firemní aplikace',
                        'lead'  => 'Analýza, vývoj, provoz.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'  => 'split',
                            'title' => 'Na míru byznysu',
                            'content' => [
                                ['html' => '<p>Od discovery po provoz a monitoring.</p>'],
                                ['html' => '<p>Bezpečnost a UX jsou základ.</p>'],
                            ],
                            'image' => ['src' => '/storage/images/services/app.jpg', 'alt' => 'Aplikace'],
                            'imagePosition' => 'right',
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'Dodávka end-to-end',
                            'items'   => [
                                ['title' => 'UX/UI', 'text' => 'Čitelné, rychlé, přehledné.', 'icon' => 'bolt'],
                            ],
                        ],
                    ],
                ],
            ],
            'zakazkovy-vyvoj' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'Zakázkový vývoj',
                        'lead'  => 'Backend, frontend i integrace.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'    => 'columns',
                            'title'   => 'Stack & kvalita',
                            'columns' => [
                                ['content' => [
                                    ['html' => '<h3>Stack</h3><ul><li>Laravel</li><li>Vue</li><li>K8s</li></ul>'],
                                ]],
                                ['content' => [
                                    ['html' => '<h3>Kvalita</h3><ul><li>Testy</li><li>CI/CD</li><li>Observabilita</li></ul>'],
                                ]],
                            ],
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'Engineering',
                            'items'   => [
                                ['title' => 'Testy', 'text' => 'Unit/Feature/Browser.', 'icon' => 'bolt'],
                            ],
                        ],
                    ],
                ],
            ],
            'migrace' => [
                'is_published' => true,
                'data' => [
                    'hero' => [
                        'title' => 'Migrace',
                        'lead'  => 'Bezpečné přesuny dat i aplikací.',
                        'image' => '/storage/images/services/hero-vps.jpg',
                    ],
                    'sections' => [
                        [
                            'type'  => 'split',
                            'title' => 'Bez výpadků',
                            'content' => [
                                ['html' => '<p>On-prem → cloud, cloud → cloud.</p>'],
                                ['html' => '<p>Plán, testy, fallback a dohled.</p>'],
                            ],
                            'image' => ['src' => '/storage/images/services/migration.jpg', 'alt' => 'Migrace'],
                            'imagePosition' => 'left',
                        ],
                        [
                            'type' => 'features',
                            'heading' => 'Bez výpadků',
                            'items'   => [
                                ['title' => 'Rollback plán', 'text' => 'Bezpečnost především.', 'icon' => 'bolt'],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        // Vytvoření / update statických stránek
        foreach ($staticPages as $slug => $pageData) {
            Page::updateOrCreate(['slug' => $slug], $pageData);
        }

        // Vytvoření / update stránek pro služby
        foreach ($servicePages as $slug => $pageData) {
            Page::updateOrCreate(['slug' => $slug], $pageData);
        }

        $this->command->info('Pages byly úspěšně naplněny.');
        $this->command->info('Počet statických stránek: ' . count($staticPages));
        $this->command->info('Počet služebních stránek: ' . count($servicePages));
    }
}
