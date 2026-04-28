<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $household = $request->user()->household;

        if (! $household) {
            return redirect()->route('onboarding');
        }

        $filters = $request->validate([
            'type'        => ['nullable', 'in:income,expense'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'month'       => ['nullable', 'date_format:Y-m'],
            'search'      => ['nullable', 'string', 'max:100'],
        ]);

        $query = $household->transactions()
            ->with('category:id,name,color,icon')
            ->latest('transacted_at')
            ->latest('id');

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['month'])) {
            [$year, $month] = explode('-', $filters['month']);
            $query->whereYear('transacted_at', $year)
                  ->whereMonth('transacted_at', $month);
        }

        if (! empty($filters['search'])) {
            $query->where('description', 'like', '%' . $filters['search'] . '%');
        }

        $transactions = $query->paginate(25)->withQueryString();

        $categories = $household->categories()
            ->orderBy('type')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'color', 'icon']);

        return Inertia::render('transactions', [
            'transactions' => $transactions,
            'categories'   => $categories,
            'filters'      => $filters,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type'           => ['required', 'in:income,expense'],
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'currency'       => ['required', 'in:NGN,USD'],
            'category_id'    => ['nullable', 'integer', 'exists:categories,id'],
            'description'    => ['nullable', 'string', 'max:255'],
            'transacted_at'  => ['required', 'date'],
        ]);

        auth()->user()->household->transactions()->create($validated);

        return back();
    }
}
