<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Reference\ReferenceSaveRequest;
use App\Models\Reference;
use App\Traits\ReferenceTrait;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ReferenceController
 * - Veřejný výpis referencí
 * - Admin akce (store/update/destroy) – samotné UI řeší dashboard v PageControlleru
 */
class ReferenceController extends Controller
{
    use ReferenceTrait;

    public function __construct()
    {
        $this->middleware('auth')->only(['store', 'update', 'destroy']);
    }

    /** PUBLIC: /reference */
    public function index(): Response
    {
        return Inertia::render('References/Index', [
            'references' => $this->prepareForDisplay(),
        ]);
    }

    /** ADMIN: vytvoření nové položky (rollback souboru při chybě) */
    public function store(ReferenceSaveRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $newLogo = null;

        try {
            if ($file = $request->file('logo_file')) {
                $newLogo = $this->saveLogo($file, $payload['title'] ?? null);
                $payload['logo'] = $newLogo;
            }
            $payload['logo_alt'] = $payload['logo_alt'] ?? ($payload['title'] ?? null);

            DB::transaction(function () use ($payload) {
                Reference::create($payload);
            });

            return redirect()
                ->route('admin.dashboard', ['view' => 'references'])
                ->with('success', 'Reference byla vytvořena.');
        } catch (\Throwable $e) {
            // DB selhala → smaž právě nahrané logo, ať nezůstane sirotek
            if ($newLogo) {
                $this->deleteLogoIfLocal($newLogo);
            }
            throw $e;
        }
    }

    /** ADMIN: update položky – staré logo smazat až po commitu, při chybě smazat nové */
    public function update(ReferenceSaveRequest $request, Reference $reference): RedirectResponse
    {
        $payload = $request->validated();
        $newLogo = null;
        $oldLogo = $reference->logo;

        try {
            if ($file = $request->file('logo_file')) {
                $newLogo = $this->saveLogo($file, $payload['title'] ?? null);
                $payload['logo'] = $newLogo;
            }
            $payload['logo_alt'] = $payload['logo_alt'] ?? ($payload['title'] ?? null);

            DB::transaction(function () use ($reference, $payload) {
                $reference->update($payload);
            });

            if ($newLogo && $oldLogo) {
                DB::afterCommit(function () use ($oldLogo) {
                    $this->deleteLogoIfLocal($oldLogo);
                });
            }

            return redirect()
                ->route('admin.dashboard', ['view' => 'references', 'id' => $reference->id])
                ->with('success', 'Reference byla upravena.');
        } catch (\Throwable $e) {
            // chyba → smaž nově uložené logo, aby nezůstalo ve storage
            if ($newLogo) {
                $this->deleteLogoIfLocal($newLogo);
            }
            throw $e;
        }
    }

    /** ADMIN: smazání položky – soubor smaž po commitu */
    public function destroy(Reference $reference): RedirectResponse
    {
        $logoToDelete = $reference->logo;

        DB::transaction(function () use ($reference) {
            $reference->delete();
        });

        DB::afterCommit(function () use ($logoToDelete) {
            if ($logoToDelete) {
                $this->deleteLogoIfLocal($logoToDelete);
            }
        });

        return redirect()
            ->route('admin.dashboard', ['view' => 'references'])
            ->with('success', 'Reference byla smazána.');
    }
}
