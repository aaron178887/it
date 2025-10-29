<?php
// database/seeders/ReferenceSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reference;

class ReferenceSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'logo' => '/images/references/client-logo1.svg',
                'logo_alt' => 'Logo klienta 1',
                'title' => 'E-shop v cloudu',
                'description' => 'Škálovatelná infrastruktura pro e-shop s více než 1 milionem návštěv měsíčně, dostupnost 99,99 % a automatické zálohy.',
                'tag' => 'VPS + vyvažování zátěže',
            ],
            [
                'logo' => '/images/references/client-logo2.svg',
                'logo_alt' => 'Logo klienta 2',
                'title' => 'Spravované servery pro SaaS',
                'description' => 'Robustní řešení pro poskytovatele SaaS s plnou správou, garantovaným SLA a proaktivním monitoringem.',
                'tag' => 'Spravované servery',
            ],
            [
                'logo' => '/images/references/client-logo3.svg',
                'logo_alt' => 'Logo klienta 3',
                'title' => 'Nasazení Kubernetes',
                'description' => 'Vysoce dostupný cluster Kubernetes pro fintech startup s CI/CD pipeline a podporou 24/7.',
                'tag' => 'Kubernetes',
            ],
            [
                'logo' => '/images/references/client-logo4.svg',
                'logo_alt' => 'Logo klienta 4',
                'title' => 'Hosting bankovní aplikace',
                'description' => 'Bezpečná infrastruktura pro bankovní aplikaci v souladu s PCI DSS, se šifrovanými zálohami a silným firewallem.',
                'tag' => 'Podniková aplikace',
            ],
            [
                'logo' => '/images/references/client-logo5.svg',
                'logo_alt' => 'Logo klienta 5',
                'title' => 'Škálování herní platformy',
                'description' => 'Infrastruktura pro online hraní s nízkou latencí, auto-škálováním serverů a globálním doručováním přes CDN.',
                'tag' => 'VPS + CDN',
            ],
            [
                'logo' => '/images/references/client-logo6.svg',
                'logo_alt' => 'Logo klienta 6',
                'title' => 'Migrace zdravotnictví do cloudu',
                'description' => 'Migrace zdravotnických systémů do cloudu v souladu s HIPAA, se šifrovaným úložištěm a nepřetržitým monitoringem.',
                'tag' => 'Migrace do cloudu',
            ],
        ];

        foreach ($rows as $r) {
            Reference::create($r);
        }
    }
}
