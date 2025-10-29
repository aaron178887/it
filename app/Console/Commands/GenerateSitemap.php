<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Service;
use App\Models\Page;
use App\Models\Reference;
use Illuminate\Support\Facades\File;

class GenerateSitemap extends Command
{
    /**
     * Název příkazu pro artisan.
     *
     * Spustíš: php artisan sitemap:generate
     */
    protected $signature = 'sitemap:generate';

    protected $description = 'Vygeneruje public/sitemap.xml z aktuálních stránek a služeb';

    public function handle(): int
    {
        $baseUrl = config('app.url') ?? url('/');

        // Vezmeme publikované služby
        $services = Service::query()
            ->where('is_published', true)
            ->orderByDesc('updated_at')
            ->get(['slug','updated_at']);

        // Statické stránky
        $staticUrls = [
            '/',
            '/o-nas',
            '/kontakt',
            '/reference',
        ];

        // Začátek XML
        $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Statické
        foreach ($staticUrls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}{$url}</loc>\n";
            $xml .= "    <priority>0.8</priority>\n";
            $xml .= "  </url>\n";
        }

        // Služby z DB
        foreach ($services as $s) {
            $lastmod = $s->updated_at ? $s->updated_at->timezone('UTC')->toAtomString() : null;
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}/sluzby/{$s->slug}</loc>\n";
            if ($lastmod) {
                $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
            }
            $xml .= "    <priority>0.7</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>' . PHP_EOL;

        // Ulož do public/
        File::put(public_path('sitemap.xml'), $xml);

        $this->info('✅ Sitemap vygenerována: public/sitemap.xml');

        return self::SUCCESS;
    }
}
