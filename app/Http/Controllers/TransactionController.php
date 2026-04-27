<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
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
