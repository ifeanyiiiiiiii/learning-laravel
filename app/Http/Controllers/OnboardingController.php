<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(): Response|RedirectResponse
    {
        if (auth()->user()->household) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('onboarding');
    }

    public function store(Request $request): RedirectResponse
    {
        if (auth()->user()->household) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        auth()->user()->household()->create([
            'name' => $validated['name'],
        ]);

        return redirect()->route('dashboard');
    }
}
