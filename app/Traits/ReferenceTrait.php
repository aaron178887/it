<?php
declare(strict_types=1);

namespace App\Traits;

use App\Models\Reference;
use App\Helpers\FileHelper;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

trait ReferenceTrait
{
    /* =========================
     *  Dashboard / listing
     * ========================= */

    /**
     * Připraví data pro dashboard sekci "Reference".
     * - $mode: 'list' | 'create' | 'edit'
     * - $id:   pouze integer; null = bez detailu
     */
    public function prepareDataForDashboard(?int $id = null, string $mode = 'list'): array
    {
        if ($mode === 'create') {
            return [
                'references' => $this->prepareReferencesList(),
                'reference'  => null,
                'mode'       => 'create',
            ];
        }

        if ($id !== null) {
            $reference = Reference::findOrFail($id);
            return [
                'references' => $this->prepareReferencesList(),
                'reference'  => $reference,
                'mode'       => 'edit',
            ];
        }

        return [
            'references' => $this->prepareReferencesList(),
            'reference'  => null,
            'mode'       => 'list',
        ];
    }

    public function prepareReferencesList(): array
    {
        return Reference::orderByDesc('id')
            ->get(['id', 'logo', 'logo_alt', 'title', 'description', 'tag', 'created_at', 'updated_at'])
            ->toArray();
    }

    /** Data pro veřejný výpis /reference */
    public function prepareForDisplay(): array
    {
        return Reference::query()
            ->orderBy('id')
            ->get(['id', 'logo', 'logo_alt', 'title', 'description', 'tag'])
            ->toArray();
    }

    /** PageController->dashboard volá tuto metodu. */
    private function getReference(?int $id = null, string $mode = 'list'): array
    {
        return $this->prepareDataForDashboard($id, $mode);
    }

    /* =========================
     *  Image helpers
     * ========================= */

    /** Uloží logo a vrátí jeho veřejnou URL (/storage/images/references/...). */
    public function saveLogo(UploadedFile $file, ?string $title): string
    {
        $relDir = 'images/references';

        $ext  = strtolower($file->getClientOriginalExtension() ?: 'png');
        $base = Str::slug($title ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        // lehké snížení kolizí
        $name = $base . '-' . date('Ymd-His') . '-' . Str::random(5) . '.' . $ext;

        // sjednocení s FileHelper API (idempotentní)
        FileHelper::ensureDirectoryExists(FileHelper::abs($relDir));
        $file->storeAs($relDir, $name, 'public');

        return FileHelper::url($relDir . '/' . $name); // => /storage/images/references/...
    }

    /** Smaže logo, pokud ukazuje na lokální storage. Idempotentní. */
    public function deleteLogoIfLocal(string $url): void
    {
        $path = parse_url($url, PHP_URL_PATH) ?? $url;

        // nová varianta – /storage/images/references/...
        $prefixStorage = '/storage/images/references/';
        if (str_starts_with($path, $prefixStorage)) {
            $rel = ltrim(substr($path, strlen('/storage/')), '/'); // 'images/references/...'
            Storage::disk('public')->delete($rel);
            return;
        }

        // stará varianta – /images/references/... v public/
        $prefixPublic = '/images/references/';
        if (str_starts_with($path, $prefixPublic)) {
            $abs = public_path(ltrim($path, '/'));
            if (is_string($abs) && file_exists($abs)) {
                @unlink($abs);
            }
        }
    }

    /** (Nepoužité, ponecháno pro kompatibilitu) */
    public function processLogoUpload(?UploadedFile $file, ?string $title, ?string $currentLogo = null): ?string
    {
        if (!$file) {
            return null;
        }
        if ($currentLogo) {
            $this->deleteLogoIfLocal($currentLogo);
        }
        return $this->saveLogo($file, $title);
    }

    /* =========================
     *  Data processing
     * ========================= */

    public function prepareReferenceData(array $data, ?UploadedFile $logoFile = null): array
    {
        $data['logo_alt'] = $data['logo_alt'] ?? $data['title'];

        if ($logoFile) {
            $data['logo'] = $this->saveLogo($logoFile, $data['title']);
        }

        return $data;
    }

    /**
     * Update varianta – nově už NEMAŽE staré logo.
     * Staré logo smaž až po úspěšném commitu (řeší controller).
     */
    public function prepareReferenceUpdateData(array $data, Reference $reference, ?UploadedFile $logoFile = null): array
    {
        $data['logo_alt'] = $data['logo_alt'] ?? $data['title'];

        if ($logoFile) {
            // ulož nové logo; staré nemaž zde
            $data['logo'] = $this->saveLogo($logoFile, $data['title']);
        }

        return $data;
    }

    /** Smaže aktuální logo reference (použito při destroy — ideálně po commitu). */
    public function cleanupReference(Reference $reference): void
    {
        if ($reference->logo) {
            $this->deleteLogoIfLocal($reference->logo);
        }
    }

    public function getReferences(bool $forPublic = true): array
    {
        $query = Reference::query()->orderByDesc('id');

        if ($forPublic) {
            return $query
                ->get(['id', 'logo', 'logo_alt', 'title', 'description', 'tag'])
                ->toArray();
        }

        return $query
            ->get(['id', 'logo', 'logo_alt', 'title', 'description', 'tag', 'created_at', 'updated_at'])
            ->toArray();
    }
}
