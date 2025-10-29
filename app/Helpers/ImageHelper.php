<?php
declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

final class ImageHelper
{
    /* Konfigurace */
    public const HERO_BREAKPOINTS    = [1200, 1600, 1920];
    public const SECTION_BREAKPOINTS = [520, 720, 920];
    public const GALLERY_BREAKPOINTS = [800, 1200, 1600];

    public const HERO_MAX_HEIGHT    = 1100;
    public const SECTION_MAX_HEIGHT = 920;
    public const GALLERY_MAX_HEIGHT = 800;
    public const ABOUT_MAX_HEIGHT   = 800;

    public const QUALITY_WEBP      = 78;
    public const QUALITY_JPEG      = 82;
    public const QUALITY_THUMBNAIL = 75;

    public const THUMBNAIL_WIDTH  = 300;
    public const THUMBNAIL_HEIGHT = 200;

    /** MIME, které se pokusíme DEKÓDOVAT (ostatní uložíme „as-is“). */
    private const DECODABLE = [
        'image/jpeg','image/jpg','image/pjpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    private static ?ImageManager $imageManager = null;

    /** Vrátí singleton ImageManager (GD). */
    public static function imageManager(): ImageManager
    {
        return self::$imageManager ??= new ImageManager(new Driver());
    }

    /** Základní kontrola, že jde o image/* a upload je validní. */
    public static function isValidImage(UploadedFile $file): bool
    {
        $mime = (string) $file->getMimeType();
        return $file->isValid() && str_starts_with($mime, 'image/');
    }

    /** Uloží optimalizovaný bitmapový obrázek (fallback: uloží originál), SVG sanitizuje. */
    public static function saveOptimizedImage(
        UploadedFile $file,
        string $relDir,
        string $baseName,
        int $maxWidth,
        int $maxHeight,
        int $qualityWebp = self::QUALITY_WEBP,
        int $qualityJpeg = self::QUALITY_JPEG
    ): array {
        FileHelper::ensureDirectoryExists(FileHelper::abs($relDir));

        $mime = (string) $file->getMimeType();
        if ($mime === 'image/svg+xml') {
            return self::saveSanitizedSvg($file, $relDir, $baseName);
        }

        if (!in_array(strtolower($mime), self::DECODABLE, true)) {
            return self::saveOriginal($file, $relDir, $baseName);
        }

        try {
            $image = self::readImage($file->getPathname());
            self::resizeToFit($image, $maxWidth, $maxHeight);

            $baseAbs = FileHelper::abs(rtrim($relDir, '/').'/'.$baseName);
            [$targetAbs, $outMime, $relOut] = self::saveWithPreferredFormat($image, $baseAbs, $qualityWebp, $qualityJpeg);

            return [
                'abs'    => $targetAbs,
                'rel'    => $relOut,
                'url'    => FileHelper::url($relOut),
                'width'  => $image->width(),
                'height' => $image->height(),
                'mime'   => $outMime,
                'size'   => @filesize($targetAbs) ?: null,
            ];
        } catch (\Throwable $e) {
            return self::saveOriginal($file, $relDir, $baseName);
        }
    }

    /** Uloží responsivní sadu šířek (fallback: uloží jeden originál -orig). */
    public static function saveResponsiveSet(
        UploadedFile $file,
        string $relDir,
        string $baseName,
        array $breakpoints,
        int $maxHeight
    ): array {
        $mime = (string) $file->getMimeType();

        if ($mime === 'image/svg+xml') {
            $one = self::saveSanitizedSvg($file, $relDir, $baseName);
            return ['src' => $one['url'], 'sizes' => [], 'width' => null, 'height' => null];
        }

        if (!in_array(strtolower($mime), self::DECODABLE, true)) {
            $one = self::saveOriginal($file, $relDir, "{$baseName}-orig");
            return ['src' => $one['url'], 'sizes' => [], 'width' => null, 'height' => null];
        }

        $urls = [];
        $currentWidth = null;

        try {
            foreach ($breakpoints as $width) {
                $currentWidth = $width;
                $res = self::saveOptimizedImage($file, $relDir, "{$baseName}-{$width}", $width, $maxHeight);
                $urls[$width] = $res['url'];
            }
            $maxWidth = (int) max($breakpoints);
            return [
                'src'    => $urls[$maxWidth] ?? reset($urls),
                'sizes'  => $urls,
                'width'  => $maxWidth,
                'height' => $maxHeight,
            ];
        } catch (\Throwable $e) {
            Log::error('ImageHelper.saveResponsiveSet failed', [
                'relDir'    => $relDir,
                'base'      => $baseName,
                'atWidth'   => $currentWidth,
                'maxHeight' => $maxHeight,
                'msg'       => $e->getMessage(),
            ]);
            $one = self::saveOriginal($file, $relDir, "{$baseName}-orig");
            return ['src' => $one['url'], 'sizes' => [], 'width' => null, 'height' => null];
        }
    }

    /** Vytvoří náhled (fallback: uloží originál -thumb). */
    public static function createThumbnail(
        UploadedFile $file,
        string $relDir,
        string $baseName,
        int $width = self::THUMBNAIL_WIDTH,
        int $height = self::THUMBNAIL_HEIGHT,
        int $quality = self::QUALITY_THUMBNAIL
    ): array {
        FileHelper::ensureDirectoryExists(FileHelper::abs($relDir));

        $mime = (string) $file->getMimeType();
        if ($mime === 'image/svg+xml') {
            return self::saveSanitizedSvg($file, $relDir, "{$baseName}-thumb");
        }

        if (!in_array(strtolower($mime), self::DECODABLE, true)) {
            return self::saveOriginal($file, $relDir, "{$baseName}-thumb");
        }

        try {
            $image = self::readImage($file->getPathname());

            if (method_exists($image, 'cover')) {
                $image->cover($width, $height);
            } else {
                [$tw, $th] = self::calculateTargetSize($image, max($width, $height), max($width, $height));
                if (method_exists($image, 'scale')) $image->scale($tw, $th);
                else $image->resize($tw, $th, function ($c) { $c->aspectRatio(); $c->upsize(); });
                $image->crop($width, $height, max(0, (int)(($tw - $width) / 2)), max(0, (int)(($th - $height) / 2)));
            }

            $baseAbs = FileHelper::abs(rtrim($relDir, '/').'/'.$baseName);
            [$targetAbs, $outMime, $relOut] = self::saveWithPreferredFormat($image, $baseAbs, $quality, self::QUALITY_JPEG);

            return [
                'abs'    => $targetAbs,
                'rel'    => $relOut,
                'url'    => FileHelper::url($relOut),
                'width'  => $image->width(),
                'height' => $image->height(),
                'mime'   => $outMime,
                'size'   => @filesize($targetAbs) ?: null,
            ];
        } catch (\Throwable $e) {
            Log::error('ImageHelper.createThumbnail failed', [
                'relDir' => $relDir, 'base' => $baseName, 'w' => $width, 'h' => $height, 'msg' => $e->getMessage(),
            ]);
            return self::saveOriginal($file, $relDir, "{$baseName}-thumb");
        }
    }

    /** Uloží hero obrázek pro službu (set). */
    public static function saveHeroImage(UploadedFile $file, string $serviceSlug): array
    {
        $relDir = 'images/services/'.$serviceSlug;
        return self::saveResponsiveSet($file, $relDir, 'hero', self::HERO_BREAKPOINTS, self::HERO_MAX_HEIGHT);
    }

    /** Uloží obrázek sekce podle stabilního ID (set). */
    public static function saveSectionImageById(UploadedFile $file, string $serviceSlug, string $sectionId): array
    {
        $relDir = 'images/services/'.$serviceSlug;
        return self::saveResponsiveSet($file, $relDir, "section-{$sectionId}", self::SECTION_BREAKPOINTS, self::SECTION_MAX_HEIGHT);
    }

    /** Uloží about obrázek pro stránku (optimalizace). */
    public static function saveAboutImage(UploadedFile $file, string $pageSlug): array
    {
        $relDir = 'images/pages/'.$pageSlug;
        return self::saveOptimizedImage($file, $relDir, 'about', 1200, self::ABOUT_MAX_HEIGHT);
    }

    /** Uloží položku galerie (optimalizace). */
    public static function saveGalleryImage(UploadedFile $file, string $pageSlug, int $imageIndex): array
    {
        $relDir = 'images/pages/'.$pageSlug;
        return self::saveOptimizedImage($file, $relDir, "g{$imageIndex}", 1280, self::GALLERY_MAX_HEIGHT);
    }

    /** Uloží thumbnail galerie. */
    public static function saveGalleryThumbnail(UploadedFile $file, string $pageSlug, int $imageIndex): array
    {
        $relDir = 'images/pages/'.$pageSlug;
        return self::createThumbnail($file, $relDir, "g{$imageIndex}-thumb", self::THUMBNAIL_WIDTH, self::THUMBNAIL_HEIGHT);
    }

    /** Uloží hero obrázek pro CMS stránku (set). */
    public static function saveHeroImageForPage(UploadedFile $file, string $pageSlug): array
    {
        $relDir = 'images/pages/'.$pageSlug;
        return self::saveResponsiveSet($file, $relDir, 'hero', self::HERO_BREAKPOINTS, self::HERO_MAX_HEIGHT);
    }

    /** Vrátí info o existujícím obrázku. */
    public static function getImageInfo(string $absolutePath): ?array
    {
        if (!file_exists($absolutePath)) return null;
        $mime = @mime_content_type($absolutePath) ?: null;

        if ($mime === 'image/svg+xml') {
            return [
                'width' => null, 'height' => null, 'mime' => $mime,
                'size'  => @filesize($absolutePath) ?: null, 'path' => $absolutePath,
            ];
        }

        try {
            $image = self::imageManager()->read($absolutePath);
            return [
                'width'  => $image->width(),
                'height' => $image->height(),
                'mime'   => $mime,
                'size'   => @filesize($absolutePath) ?: null,
                'path'   => $absolutePath,
            ];
        } catch (\Throwable $e) {
            Log::warning('ImageHelper.getImageInfo read failed', ['path' => $absolutePath, 'msg' => $e->getMessage()]);
            return null;
        }
    }

    /** Vrátí data URI pro obrázek. */
    public static function toDataUri(string $absolutePath): ?string
    {
        if (!file_exists($absolutePath)) return null;
        $imageData = @file_get_contents($absolutePath);
        if ($imageData === false) return null;
        $mimeType = @mime_content_type($absolutePath) ?: 'application/octet-stream';
        return 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
    }

    /** Optimalizuje existující bitmapu do WEBP (fallback zůstane beze změny). */
    public static function optimizeExistingImage(
        string $absolutePath,
        int $maxWidth,
        int $maxHeight,
        int $quality = self::QUALITY_WEBP
    ): bool {
        if (!file_exists($absolutePath)) return false;
        $mime = @mime_content_type($absolutePath) ?: null;
        if ($mime === 'image/svg+xml') return true;

        try {
            $image = self::imageManager()->read($absolutePath);
            [$tw, $th] = self::calculateTargetSize($image, $maxWidth, $maxHeight);
            if ($tw < $image->width() || $th < $image->height()) {
                if (method_exists($image, 'scale')) $image->scale($tw, $th);
                else $image->resize($tw, $th, function ($c) { $c->aspectRatio(); $c->upsize(); });
            }
            $newPath = pathinfo($absolutePath, PATHINFO_DIRNAME) . '/' . pathinfo($absolutePath, PATHINFO_FILENAME) . '.webp';
            if (method_exists($image, 'toWebp')) $image->toWebp($quality)->save($newPath);
            else $image->encode('webp', $quality)->save($newPath);
            if (strtolower((string) pathinfo($absolutePath, PATHINFO_EXTENSION)) !== 'webp') @unlink($absolutePath);
            return true;
        } catch (\Throwable $e) {
            Log::error('ImageHelper.optimizeExistingImage failed', ['path' => $absolutePath, 'msg' => $e->getMessage()]);
            return false;
        }
    }

    /** Převede srcset pole na string. */
    public static function srcsetToString($srcset): ?string
    {
        if (!is_array($srcset)) return null;
        $parts = [];
        foreach ($srcset as $w => $url) {
            if (!$url) continue;
            $wInt = (int) $w;
            $parts[] = $url . ' ' . ($wInt > 0 ? $wInt : 0) . 'w';
        }
        return $parts ? implode(', ', $parts) : null;
    }

    /** Normalizuje obrazová data pro UI. */
    public static function normalizeImage($img, string $title = ''): ?array
    {
        if (!$img) return null;

        if (is_string($img)) {
            return ['src' => $img, 'alt' => $title ?: 'Ilustrace', 'srcset' => null, 'srcsetStr' => null];
        }

        if (is_array($img) && !empty($img['src'])) {
            $srcset = $img['srcset'] ?? null;
            return [
                'src' => (string) $img['src'],
                'alt' => (string) ($img['alt'] ?? $title ?: 'Ilustrace'),
                'srcset' => is_array($srcset) ? $srcset : null,
                'srcsetStr' => self::srcsetToString($srcset),
            ];
        }

        return null;
    }

    /** Sanitizuje a uloží SVG jako .svg. */
    private static function saveSanitizedSvg(UploadedFile $file, string $relDir, string $baseName): array
    {
        $raw = @file_get_contents($file->getPathname()) ?: '';
        $svg = DataHelper::sanitizeSvg($raw);
        if ($svg === '') throw new \RuntimeException('Invalid or unsafe SVG content.');

        $baseAbs = FileHelper::abs(rtrim($relDir, '/').'/'.$baseName).'.svg';
        FileHelper::ensureDirectoryExists(dirname($baseAbs));
        if (@file_put_contents($baseAbs, $svg) === false) throw new \RuntimeException('Failed to write sanitized SVG.');

        $rel = ltrim(FileHelper::getRelativePath($baseAbs), '/');

        return [
            'abs'    => $baseAbs,
            'rel'    => $rel,
            'url'    => FileHelper::url($rel),
            'width'  => null,
            'height' => null,
            'mime'   => 'image/svg+xml',
            'size'   => @filesize($baseAbs) ?: null,
        ];
    }

    /** Automatická orientace. */
    public static function autoOrient($image)
    {
        if (method_exists($image, 'orientate')) return $image->orientate();
        if (method_exists($image, 'orient'))    return $image->orient();
        return $image;
    }

    /** Spočítá cílové rozměry se zachováním poměru. */
    public static function calculateTargetSize($image, int $maxWidth, int $maxHeight): array
    {
        $w = $image->width();
        $h = $image->height();
        if ($w <= 0 || $h <= 0) return [min(1, $maxWidth), min(1, $maxHeight)];
        $scale = min($maxWidth / $w, $maxHeight / $h, 1);
        $tw = (int) round($w * $scale);
        $th = (int) round($h * $scale);
        return [max(1, $tw), max(1, $th)];
    }

    /** Načte bitmapu a aplikuje orientaci. */
    private static function readImage(string $pathname)
    {
        $image = self::imageManager()->read($pathname);
        return self::autoOrient($image);
    }

    /** Změní velikost bitmapy do limitů. */
    private static function resizeToFit($image, int $maxWidth, int $maxHeight): void
    {
        [$tw, $th] = self::calculateTargetSize($image, $maxWidth, $maxHeight);
        if (method_exists($image, 'scale')) { $image->scale($tw, $th); return; }
        $image->resize($tw, $th, function ($c) { $c->aspectRatio(); $c->upsize(); });
    }

    /** Uloží WEBP (fallback JPEG). */
    private static function saveWithPreferredFormat($image, string $baseAbs, int $qualityWebp, int $qualityJpeg): array
    {
        $targetAbs = "{$baseAbs}.webp";
        try {
            if (method_exists($image, 'toWebp')) $image->toWebp($qualityWebp)->save($targetAbs);
            else $image->encode('webp', $qualityWebp)->save($targetAbs);

            $rel = ltrim(FileHelper::getRelativePath($targetAbs), '/');
            return [$targetAbs, 'image/webp', $rel];
        } catch (\Throwable $e) {
            Log::warning('ImageHelper.saveWithPreferredFormat webp failed, trying jpeg', ['base' => $baseAbs, 'msg' => $e->getMessage()]);
            $targetAbs = "{$baseAbs}.jpg";
            if (method_exists($image, 'toJpeg')) $image->toJpeg($qualityJpeg)->save($targetAbs);
            else $image->encode('jpg', $qualityJpeg)->save($targetAbs);

            $rel = ltrim(FileHelper::getRelativePath($targetAbs), '/');
            return [$targetAbs, 'image/jpeg', $rel];
        }
    }

    /** Uloží originál souboru „as-is“. */
    private static function saveOriginal(UploadedFile $file, string $relDir, string $baseName): array
    {
        $ext = self::extFromMime((string)$file->getMimeType(), $file->getClientOriginalExtension() ?: 'bin');
        $fileName = "{$baseName}.{$ext}";
        FileHelper::ensureDirectoryExists(FileHelper::abs($relDir));
        FileHelper::storeUploadedFile($file, FileHelper::abs($relDir), $fileName);

        $rel = trim($relDir, '/').'/'.$fileName;
        return [
            'abs'   => FileHelper::abs($rel),
            'rel'   => $rel,
            'url'   => FileHelper::url($rel),
            'width' => null,
            'height'=> null,
            'mime'  => (string)$file->getMimeType(),
            'size'  => $file->getSize(),
        ];
    }

    /** Určí příponu z MIME. */
    private static function extFromMime(string $mime, ?string $fallback = null): string
    {
        return match (strtolower($mime)) {
            'image/jpeg','image/jpg','image/pjpeg' => 'jpg',
            'image/png'   => 'png',
            'image/webp'  => 'webp',
            'image/gif'   => 'gif',
            'image/avif'  => 'avif',
            'image/heic'  => 'heic',
            'image/heif'  => 'heif',
            'image/svg+xml' => 'svg',
            default => $fallback ?? 'bin',
        };
    }
}
