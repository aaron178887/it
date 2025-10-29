<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReferenceController;
use App\Http\Controllers\AuthController;

Route::get('/', fn () => Inertia::render('Home/Index'))->name('home');

Route::get('/sluzby/{page:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('/reference', [ReferenceController::class, 'index'])->name('references.index');

Route::get('/o-nas', [PageController::class, 'show'])->defaults('slug', 'o-nas')->name('pages.about');
Route::get('/kontakt', [PageController::class, 'show'])->defaults('slug', 'kontakt')->name('pages.contact');

Route::post('/kontakt', [ContactController::class, 'store'])->name('kontakt.store');
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/', [PageController::class, 'dashboard'])->name('admin.dashboard');

    Route::post('/pages/{slug}', [PageController::class, 'update'])->name('admin.pages.update');

    Route::get('/services/create', [ServiceController::class, 'create'])->name('services.create');
    Route::get('/services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::get('/services/{service}/preview', [ServiceController::class, 'preview'])->name('admin.services.preview');
    Route::patch('/services/{service}/publish', [ServiceController::class, 'setPublished'])->name('admin.services.setPublished');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

    Route::post('/references', [ReferenceController::class, 'store'])->name('admin.references.store');
    Route::put('/references/{reference}', [ReferenceController::class, 'update'])->name('admin.references.update');
    Route::delete('/references/{reference}', [ReferenceController::class, 'destroy'])->name('admin.references.destroy');

    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('admin.profile.update');
});


Route::get('/login',  [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
