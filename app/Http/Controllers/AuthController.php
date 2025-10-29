<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (! Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'email' => 'Nesprávné přihlašovací údaje.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    public function updateProfile(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validated();

        $user->fill([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['new_password'])) {
            $user->password = $validated['new_password']; 
        }

        $user->save();

        return back()->with('success', 'Profil byl aktualizován.');
    }
}
