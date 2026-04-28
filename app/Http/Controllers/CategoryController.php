<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $household = $request->user()->household;

        if (! $household) {
            return redirect()->route('onboarding');
        }

        $categories = $household->categories()
            ->withCount('transactions')
            ->orderBy('type')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'color', 'icon']);

        return Inertia::render('categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $household = $request->user()->household;

        abort_unless($household, 403);

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'type'  => ['required', 'in:income,expense'],
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon'  => ['nullable', 'string', 'max:100'],
        ]);

        $household->categories()->create($validated);

        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->household_id === $request->user()->household?->id, 403);

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon'  => ['nullable', 'string', 'max:100'],
        ]);

        $category->update($validated);

        return back();
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->household_id === $request->user()->household?->id, 403);

        // Prevent deleting if transactions are linked to it
        abort_if($category->transactions()->exists(), 422, 'Category has transactions and cannot be deleted.');

        $category->delete();

        return back();
    }
}
