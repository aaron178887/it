<?php
declare(strict_types=1);

// app/Http/Controllers/ServiceController.php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Http\Requests\Service\ServiceStoreRequest;
use App\Http\Requests\Service\ServiceUpdateRequest;
use App\Models\Page;
use App\Models\Service;
use App\Support\Slug;
use App\Traits\ServiceTrait;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    use ServiceTrait;

    public function __construct()
    {
        $this->middleware('auth')->only([
            'create',
            'store',
            'edit',
            'update',
            'setPublished',
            'preview',
            'destroy',
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('admin.dashboard', ['view' => 'addService']);
    }

    /**
     * CREATE (atomicky přes DB transakci).
     * FS scaffolding se už nevytváří dopředu; nejdřív proběhne preflight kolize.
     * Výjimky z validací převádíme na ValidationException (422) s napojením na pole "slug".
     */
    public function store(ServiceStoreRequest $request): RedirectResponse
    {
        $data     = $request->validated();
        $safeSlug = null;

        try {
            // 1) Validace slugu
            $safeSlug = Slug::assert($data['slug']);

            // 1a) Preflight kolize složky → rovnou 422 (bez vytváření složek)
            //    nově tolerujeme prázdnou existující složku (idempotence po předchozím pádu requestu)
            if ($msg = $this->checkServiceDirCollision($safeSlug, true)) {
                throw ValidationException::withMessages(['slug' => $msg]);
            }

            // 2) Dál už pracujeme pouze s validovaným slugem
            $data['slug'] = $safeSlug;

            // 3) Sestav payloady a ulož v transakci
            [$pageData, $serviceData] = $this->buildCreatePayloads($request, $data);

            DB::transaction(function () use ($pageData, $serviceData) {
                $page = Page::create($pageData);
                Service::create(array_merge(['id' => $page->id], $serviceData));
            });

            // 4) Invalidate cache a hotovo
            $this->invalidateServiceNav();

            return redirect()
                ->route('admin.dashboard', ['view' => 'service'])
                ->with('success', "Služba „{$data['hero_title']}“ byla uložena.");

        } catch (ValidationException $e) {
            throw $e;

        } catch (\InvalidArgumentException|\RuntimeException $e) {
            // typicky nevalidní slug, inline JS v obsahu, apod.
            Log::warning('service.store validation/runtime failed', [
                'slug' => $safeSlug ?? ($data['slug'] ?? null),
                'msg'  => $e->getMessage(),
            ]);

            // Pokud se cestou přece jen něco vytvořilo (např. v upload handlers), zkus složku uklidit
            if ($safeSlug) {
                try { FileHelper::deleteServiceDirectory($safeSlug); } catch (\Throwable) {}
            }

            throw ValidationException::withMessages(['slug' => $e->getMessage()]);

        } catch (\Throwable $e) {
            Log::error('service.store failed', [
                'slug' => $safeSlug ?? ($data['slug'] ?? null),
                'msg'  => $e->getMessage(),
            ]);

            if ($safeSlug) {
                try { FileHelper::deleteServiceDirectory($safeSlug); } catch (\Throwable) {}
            }

            throw $e;
        }
    }

    /** Přesměruje do admin detailu existující služby. */
    public function edit(Service $service): RedirectResponse
    {
        return redirect()->route('admin.dashboard', [
            'view' => 'service',
            'id'   => $service->id,
        ]);
    }

    /**
     * UPDATE (atomicky přes DB transakci).
     * Při změně slugu přesune FS složku předem; při selhání se pokusí vrátit zpět.
     * Výjimky z validací převádíme na ValidationException (422) s napojením na pole "slug".
     */
    public function update(ServiceUpdateRequest $request, Service $service): RedirectResponse
    {
        $data    = $request->validated();
        $oldSlug = $service->page->slug;
        $movedFS = false;
        $newSlug = null;

        try {
            // 1) Validace nového slugu dřív, než sáhneš na FS
            $newSlug = Slug::assert($data['slug']);

            // 2) Přesun FS složky, pokud se slug mění
            if ($newSlug !== $oldSlug) {
                FileHelper::moveServiceDirectory($oldSlug, $newSlug);
                $movedFS = true;
            }

            // 3) Postav payloady a ulož v transakci
            [$pageData, $serviceData] = $this->buildUpdatePayloads($request, $service, $data);

            DB::transaction(function () use ($service, $pageData, $serviceData) {
                $service->page->update($pageData);
                $service->update($serviceData);
            });

            // 4) Invalidate cache a hotovo
            $this->invalidateServiceNav();

            return redirect()
                ->route('admin.dashboard', ['view' => 'service', 'id' => $service->id])
                ->with('success', "Služba „{$data['hero_title']}“ byla aktualizována.");

        } catch (\InvalidArgumentException|\RuntimeException $e) {
            // rollback případného FS přesunu a validace na "slug"
            Log::warning('service.update validation/runtime failed', [
                'id'      => $service->id,
                'oldSlug' => $oldSlug,
                'newSlug' => $newSlug,
                'movedFS' => $movedFS,
                'msg'     => $e->getMessage(),
            ]);

            if ($movedFS && $newSlug !== null && $newSlug !== $oldSlug) {
                try { FileHelper::moveServiceDirectory($newSlug, $oldSlug); } catch (\Throwable) {}
            }

            throw ValidationException::withMessages(['slug' => $e->getMessage()]);

        } catch (\Throwable $e) {
            // obecná chyba – pokus o návrat FS a zalogovat
            Log::error('service.update failed', [
                'id'      => $service->id,
                'oldSlug' => $oldSlug,
                'newSlug' => $newSlug,
                'movedFS' => $movedFS,
                'msg'     => $e->getMessage(),
            ]);

            if ($movedFS && $newSlug !== null && $newSlug !== $oldSlug) {
                try { FileHelper::moveServiceDirectory($newSlug, $oldSlug); } catch (\Throwable) {}
            }

            throw $e;
        }
    }

    /** Veřejné zobrazení služby podle slugu (pouze publikované). */
    public function show(string $slug): Response
    {
        $page = Page::with('service')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->whereHas('service')
            ->firstOrFail();

        $service = $this->getServiceForDisplay($page);

        return Inertia::render('Services/Index', [
            'service' => $service,
            'preview' => false,
        ]);
    }

    /**
     * Nastaví publikovanost stránky služby.
     * Vrací 204 pro JSON klienty, jinak redirect do adminu.
     */
    public function setPublished(Request $request, Service $service)
    {
        $data = $request->validate([
            'is_published' => ['required', 'boolean'],
        ]);

        $service->page->is_published = $data['is_published'];
        $service->page->save();

        $this->invalidateServiceNav();

        if ($request->wantsJson()) {
            return response()->noContent();
        }

        return redirect()
            ->route('admin.dashboard', ['view' => 'service'])
            ->with('success', 'Stav publikace byl změněn.');
    }

    /** Náhled služby bez ohledu na publikaci (pro admin). */
    public function preview(Service $service): Response
    {
        $serviceData = $this->getServiceForDisplay($service->page);

        return Inertia::render('Services/Index', [
            'service' => $serviceData,
            'preview' => true,
        ]);
    }

    /**
     * Smaže službu:
     * - DB záznamy v transakci
     * - FS složku až po commitu (DB::afterCommit)
     * Vrací 204 pro JSON klienty, jinak redirect do adminu.
     */
    public function destroy(Request $request, Service $service)
    {
        $slug = $service->page->slug;

        DB::transaction(function () use ($service) {
            // mažeme Page (Service má vazbu na Page id; dle schématu může být cascade/constraint)
            $service->page->delete();
        });

        DB::afterCommit(function () use ($slug) {
            try {
                FileHelper::deleteServiceDirectory($slug);
            } catch (\Throwable $e) {
                Log::error('service.destroy fs cleanup failed', ['slug' => $slug, 'msg' => $e->getMessage()]);
            }
        });

        $this->invalidateServiceNav();

        if ($request->wantsJson()) {
            return response()->noContent();
        }

        return redirect()
            ->route('admin.dashboard', ['view' => 'service'])
            ->with('success', 'Služba byla smazána.');
    }
}
