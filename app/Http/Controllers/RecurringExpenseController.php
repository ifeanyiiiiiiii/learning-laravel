<?php

namespace App\Http\Controllers;

use App\Models\RecurringExpense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RecurringExpenseController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $household = $request->user()->household;

        abort_unless($household, 403);

        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'amount'      => ['required', 'numeric', 'min:0.01'],
            'currency'    => ['required', 'in:NGN,USD'],
            'frequency'   => ['required', 'in:daily,weekly,monthly'],
            'starts_at'   => ['required', 'date'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);

        $household->recurringExpenses()->create($validated);

        return back()->with('success', 'Recurring expense added.');
    }

    public function update(Request $request, RecurringExpense $recurringExpense): RedirectResponse
    {
        abort_unless($recurringExpense->household_id === $request->user()->household?->id, 403);

        $validated = $request->validate([
            'description' => ['sometimes', 'string', 'max:255'],
            'amount'      => ['sometimes', 'numeric', 'min:0.01'],
            'currency'    => ['sometimes', 'in:NGN,USD'],
            'frequency'   => ['sometimes', 'in:daily,weekly,monthly'],
            'starts_at'   => ['sometimes', 'date'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'is_active'   => ['sometimes', 'boolean'],
        ]);

        $recurringExpense->update($validated);

        return back()->with('success', 'Recurring expense updated.');
    }

    public function destroy(Request $request, RecurringExpense $recurringExpense): RedirectResponse
    {
        abort_unless($recurringExpense->household_id === $request->user()->household?->id, 403);

        $recurringExpense->delete();

        return back()->with('success', 'Recurring expense deleted.');
    }
}
