<?php
declare(strict_types=1);

namespace App\Helpers;

use App\Support\Slug;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\File as FsFile;
use Illuminate\Support\Facades\Storage;

final class FileHelper
{
    public const DIRECTORY_PERMISSIONS = 0775;
    public const MAX_FILE_SIZE = 8192; // KB

    /* =========================
     *  Public API — Disk, cesty a URL
     * ========================= */

    /** Adapter pro Storage 'public'. */
    private static function disk(): FilesystemAdapter
    {
        return Storage::disk('public');
    }

    /** Absolutní cesta pro relativní path na public disku. */
    public static function abs(string $relative): string
    {
        return self::cleanPath(self::disk()->path(ltrim($relative, '/')));
    }

    /** Veřejná URL pro relativní path na public disku. */
    public static function url(string $relative): string
    {
        return self::disk()->url(ltrim($relative, '/'));
    }

    /**
     * Veřejná URL z absolutní cesty (pokud je v public disku), jinak fallback:
     * - pokud je to uvnitř public_path(), vrací relativní URL od webrootu
     * - jinak vrací původní absolutní cestu
     */
    public static function publicUrl(string $absPath): string
    {
        $rel = self::relFromAbs($absPath);
        if ($rel !== null) {
            return self::url($rel);
        }

        $public = self::cleanPath(rtrim(public_path(), '/'));
        $clean  = self::cleanPath($absPath);
        if (str_starts_with($clean, $public)) {
            $rel = ltrim(substr($clean, strlen($public)), '/');
            return '/'.$rel;
        }

        return $absPath;
    }

    /** Vrátí relativní cestu (s počátečním /), pokud je absolutní uvnitř public disku; jinak vrací původní. */
    public static function getRelativePath(string $absolutePath): string
    {
        $rel = self::relFromAbs($absolutePath);
        return $rel ? '/'.$rel : $absolutePath;
    }

    /** Zda je daná cesta uvnitř public disku. */
    public static function isInPublicPath(string $path): bool
    {
        $root  = self::diskRoot();
        $clean = self::cleanPath($path);
        return str_starts_with($clean, $root);
    }

    /** Normalizuje zápis cesty (oddělovače, duplicitní lomítka). */
    public static function cleanPath(string $path): string
    {
        $path = str_replace(['\\', '//'], '/', $path);
        return preg_replace('#/+#', '/', $path);
    }

    /* =========================
     *  Public API — Kořeny a základní složky
     * ========================= */

    /** Relativní kořen pro /images/services. */
    private static function servicesRootRel(): string { return 'images/services'; }

    /** Relativní kořen pro /images/pages. */
    private static function pagesRootRel(): string { return 'images/pages'; }

    /** Relativní kořen pro /images/references. */
    private static function refsRootRel(): string { return 'images/references'; }

    /** Absolutní kořen složek služeb. */
    private static function servicesRootDir(): string { return self::abs(self::servicesRootRel()); }

    /** Absolutní kořen složek stránek. */
    private static function pagesRootDir(): string { return self::abs(self::pagesRootRel()); }

    /** Relativní kořen služby dle slugu. */
    private static function serviceBaseRel(string $slug): string
    {
        $slug = Slug::assert($slug);
        return self::servicesRootRel().'/'.$slug;
    }

    /** Relativní kořen stránky dle slugu. */
    private static function pageBaseRel(string $slug): string
    {
        $slug = Slug::assert($slug);
        return self::pagesRootRel().'/'.$slug;
    }

    /** Absolutní kořen služby dle slugu. */
    private static function serviceBaseDir(string $slug): string
    {
        return self::abs(self::serviceBaseRel($slug));
    }

    /** Absolutní kořen stránky dle slugu. */
    private static function pageBaseDir(string $slug): string
    {
        return self::abs(self::pageBaseRel($slug));
    }

    /* =========================
     *  Public API — Životní cyklus složek (vytvoření / smazání)
     * ========================= */

    /**
     * Vytvoří kořenovou složku služby.
     * - když složka existuje a je PRÁZDNÁ a $allowIfEmptyExists = true → idempotentní no-op
     * - když složka existuje a není prázdná → RuntimeException (kolize)
     */
    public static function createServiceDirectoryStructure(string $slug, bool $allowIfEmptyExists = false): void
    {
        $baseRel = self::serviceBaseRel($slug);
        if (self::directoryExistsRel($baseRel)) {
            if ($allowIfEmptyExists && self::isRelDirEmpty($baseRel)) {
                return;
            }
            throw new \RuntimeException('Složka pro tento slug již existuje.');
        }
        if (!self::disk()->makeDirectory($baseRel)) {
            throw new \RuntimeException('Nepodařilo se vytvořit složku služby.');
        }
    }

    /**
     * Vytvoří kořenovou složku stránky.
     * - když složka existuje a je PRÁZDNÁ a $allowIfEmptyExists = true → idempotentní no-op
     * - když složka existuje a není prázdná → RuntimeException (kolize)
     */
    public static function createPageDirectoryStructure(string $slug, bool $allowIfEmptyExists = false): void
    {
        $baseRel = self::pageBaseRel($slug);
        if (self::directoryExistsRel($baseRel)) {
            if ($allowIfEmptyExists && self::isRelDirEmpty($baseRel)) {
                return;
            }
            throw new \RuntimeException('Složka pro tento slug již existuje.');
        }
        if (!self::disk()->makeDirectory($baseRel)) {
            throw new \RuntimeException('Nepodařilo se vytvořit složku stránky.');
        }
    }

    /** Smaže složku služby. */
    public static function deleteServiceDirectory(string $slug): void
    {
        self::disk()->deleteDirectory(self::serviceBaseRel($slug));
    }

    /** Smaže složku stránky. */
    public static function deletePageDirectory(string $slug): void
    {
        self::disk()->deleteDirectory(self::pageBaseRel($slug));
    }

    /**
     * Smaže libovolnou složku (ABS i REL) – **pouze pokud je uvnitř public disku**.
     * Absolutní cesta mimo public disk → RuntimeException.
     */
    public static function deleteDirectory(string $dir): void
    {
        $rel = self::assertDiskInternalOrRelative($dir);
        self::disk()->deleteDirectory($rel);
    }

    /**
     * Smaže soubory podle patternu v názvu (ABS i REL) s libovolnou příponou – **jen uvnitř public disku**.
     */
    public static function deleteFilesByPattern(string $dir, string $pattern): void
    {
        $relDir = self::assertDiskInternalOrRelative($dir);
        $absDir = self::abs($relDir);
        if (!is_dir($absDir)) return;

        $glob = glob(self::cleanPath($absDir . DIRECTORY_SEPARATOR . "{$pattern}.*")) ?: [];
        foreach ($glob as $absPath) {
            $rel = self::relFromAbs($absPath);
            if ($rel) self::disk()->delete($rel);
        }
    }

    /**
     * Smaže soubory sekce podle stabilního ID.
     * Očekávané názvy: section-{id}-{width}.(webp|jpg|…)
     */
    public static function deleteSectionFilesById(string $sectionsDir, string $sectionId): void
    {
        self::deleteFilesByPattern($sectionsDir, "section-{$sectionId}-*");
    }

    /* =========================
     *  Public API — Existence, metadata a přesuny/uložení souborů
     * ========================= */

    /** Zajistí existenci složky (ABS i REL). */
    public static function ensureDirectoryExists(string $dir): void
    {
        $rel = self::relFromAbs($dir);
        if ($rel !== null) {
            self::disk()->makeDirectory($rel);
            return;
        }
        FsFile::ensureDirectoryExists($dir, self::DIRECTORY_PERMISSIONS, true);
    }

    /** Ověří existenci složky (ABS i REL). */
    public static function directoryExists(string $dir): bool
    {
        $rel = self::relFromAbs($dir);
        if ($rel !== null) {
            return self::directoryExistsRel($rel);
        }
        return is_dir($dir);
    }

    /** Ověří existenci souboru (ABS i REL). */
    public static function fileExists(string $path): bool
    {
        $rel = self::relFromAbs($path);
        if ($rel !== null) return self::disk()->exists($rel);
        return file_exists($path);
    }

    /** Vrátí info o souboru (ABS i REL) nebo null. */
    public static function getFileInfo(string $path): ?array
    {
        $rel = self::relFromAbs($path);
        if ($rel !== null && self::disk()->exists($rel)) {
            $abs = self::abs($rel);
            return [
                'path'      => $abs,
                'size'      => @filesize($abs) ?: null,
                'modified'  => @filemtime($abs) ?: null,
                'extension' => pathinfo($abs, PATHINFO_EXTENSION),
            ];
        }
        if (file_exists($path)) {
            return [
                'path'      => $path,
                'size'      => @filesize($path) ?: null,
                'modified'  => @filemtime($path) ?: null,
                'extension' => pathinfo($path, PATHINFO_EXTENSION),
            ];
        }
        return null;
    }

    /**
     * Zkopíruje soubor (ABS i REL) **jen v rámci public disku**.
     * Absolutní cesty mimo public → RuntimeException.
     */
    public static function copyFile(string $source, string $destination): bool
    {
        $srcRel  = self::assertDiskInternalOrRelative($source);
        $destRel = self::assertDiskInternalOrRelative($destination);

        $destAbs = self::abs($destRel);
        self::ensureDirectoryExists(dirname($destAbs));

        return self::disk()->copy($srcRel, $destRel);
    }

    /**
     * Přesune soubor (ABS i REL) **jen v rámci public disku**.
     * Absolutní cesty mimo public → RuntimeException.
     */
    public static function moveFile(string $source, string $destination): bool
    {
        $srcRel  = self::assertDiskInternalOrRelative($source);
        $destRel = self::assertDiskInternalOrRelative($destination);

        $destAbs = self::abs($destRel);
        self::ensureDirectoryExists(dirname($destAbs));

        return self::disk()->move($srcRel, $destRel);
    }

    /**
     * Uloží nahraný soubor do cílové složky (ABS i REL) **jen v rámci public disku**.
     * Absolutní cesta mimo public → RuntimeException.
     */
    public static function storeUploadedFile(\Illuminate\Http\UploadedFile $file, string $destinationAbs, string $fileName): bool
    {
        $rel = self::assertDiskInternalOrRelative($destinationAbs);
        self::disk()->makeDirectory($rel);
        return (bool) self::disk()->putFileAs($rel, $file, $fileName);
    }

    /* =========================
     *  Public API — Přesun složky služby při změně slugu
     * ========================= */

    /**
     * Přesune složku služby při změně slugu v rámci public disku.
     * Bezpečnost: kontrola, že zdroj i cíl jsou pod /images/services.
     */
    public static function moveServiceDirectory(string $oldSlug, string $newSlug): void
    {
        $rootAbs = self::servicesRootDir();

        $fromRel = self::serviceBaseRel($oldSlug);
        $toRel   = self::serviceBaseRel($newSlug);

        $fromAbs = self::abs($fromRel);
        $toAbs   = self::abs($toRel);

        foreach ($fromAbs === $toAbs ? [] : [$fromAbs, $toAbs] as $p) {
            if (!str_starts_with($p, $rootAbs)) {
                throw new \RuntimeException('Unsafe path outside services root.');
            }
        }

        if ($oldSlug === $newSlug) return;

        if (self::directoryExistsRel($toRel)) {
            throw new \RuntimeException("Target directory already exists: {$toAbs}");
        }

        if (!self::directoryExistsRel($fromRel)) {
            self::createServiceDirectoryStructure($newSlug);
            return;
        }

        self::disk()->makeDirectory($toRel);

        $files = self::disk()->allFiles($fromRel);
        foreach ($files as $fileRel) {
            $rest      = ltrim(substr($fileRel, strlen($fromRel)), '/');
            $targetRel = trim($toRel.'/'.$rest, '/');
            self::ensureDirectoryExists(dirname(self::abs($targetRel)));
            self::disk()->move($fileRel, $targetRel);
        }

        $dirs = array_reverse(self::disk()->allDirectories($fromRel));
        foreach ($dirs as $d) { self::disk()->deleteDirectory($d); }
        self::disk()->deleteDirectory($fromRel);
    }

    /* =========================
     *  Public API — Přepis cest podle slugu
     * ========================= */

    /** Přepíše /images/services/{old}/ → /images/services/{new}/ v celém datovém stromu. */
    public static function rewriteServiceImagePaths(array $data, string $oldSlug, string $newSlug): array
    {
        return self::rewritePublicPathSlug($data, 'images/services', $oldSlug, $newSlug);
    }

    /** Obecný přepis /{base}/{old}/ → /{base}/{new}/ v celém datovém stromu. */
    public static function rewritePublicPathSlug(array $data, string $base, string $oldSlug, string $newSlug): array
    {
        $from = '/' . trim($base, '/') . '/' . ltrim($oldSlug, '/') . '/';
        $to   = '/' . trim($base, '/') . '/' . ltrim($newSlug, '/') . '/';

        $walk = function (&$val) use (&$walk, $from, $to): void {
            if (is_array($val)) {
                foreach ($val as &$v) $walk($v);
            } elseif (is_string($val)) {
                $val = str_replace($from, $to, $val);
            }
        };

        $walk($data);
        return $data;
    }

    /* =========================
     *  Private — Pomocné funkce pro cesty a validace
     * ========================= */

    /** Ověří existenci složky podle REL cesty na public disku. */
    private static function directoryExistsRel(string $rel): bool
    {
        if (method_exists(self::disk(), 'directoryExists')) {
            return self::disk()->directoryExists($rel);
        }
        return count(self::disk()->files($rel)) || count(self::disk()->directories($rel));
    }

    /** Je REL složka prázdná (bez souborů i podsložek)? */
    private static function isRelDirEmpty(string $rel): bool
    {
        $disk = self::disk();
        return count($disk->files($rel)) === 0 && count($disk->directories($rel)) === 0;
    }

    /** Absolutní kořen public disku. */
    private static function diskRoot(): string
    {
        return rtrim(self::cleanPath(self::disk()->path('')), '/');
    }

    /**
     * Relativní cesta z absolutní cesty uvnitř public disku, jinak null.
     * (Nepřevádí cesty mimo public disk.)
     */
    private static function relFromAbs(string $absolute): ?string
    {
        $abs  = self::cleanPath($absolute);
        $root = self::diskRoot();
        if (str_starts_with($abs, $root)) {
            return ltrim(substr($abs, strlen($root)), '/');
        }
        return null;
    }

    /**
     * **Bezpečnostní brána**: vrátí REL cestu, pokud je vstup už REL
     * nebo absolutní uvnitř public disku. Pokud je to ABS mimo public → RuntimeException.
     */
    private static function assertDiskInternalOrRelative(string $path): string
    {
        $isAbsolute = str_starts_with($path, '/') || preg_match('~^[A-Za-z]:[\\\\/]~', $path) === 1;
        $rel = self::relFromAbs($path);
        if ($rel !== null) return $rel;
        if ($isAbsolute) {
            throw new \RuntimeException("Absolute path outside public disk is not allowed: {$path}");
        }
        return ltrim($path, '/'); // truly relative
    }
}
