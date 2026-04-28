<?php

namespace App\Http\Controllers;

use App\Models\RecurringExpense;
use App\Services\ExchangeRateService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(ExchangeRateService $fx): Response|RedirectResponse
    {
        $user = auth()->user();
        $household = $user->household;

        // No household yet — send to onboarding
        if (! $household) {
            return redirect()->route('onboarding');
        }

        $now = now();

        // ── Summary totals for the current month ──────────────────────────
        $monthlyIncome = $household->transactions()
            ->where('type', 'income')
            ->whereYear('transacted_at', $now->year)
            ->whereMonth('transacted_at', $now->month)
            ->sum('amount');

        $monthlyExpenses = $household->transactions()
            ->where('type', 'expense')
            ->whereYear('transacted_at', $now->year)
            ->whereMonth('transacted_at', $now->month)
            ->sum('amount');

        $netPosition = $monthlyIncome - $monthlyExpenses;

        // ── Recent transactions (last 10) ─────────────────────────────────
        $recentTransactions = $household->transactions()
            ->with('category:id,name,color,icon')
            ->latest('transacted_at')
            ->take(10)
            ->get(['id', 'category_id', 'amount', 'currency', 'type', 'description', 'transacted_at']);

        // ── Categories for the "add transaction" form ──────────────────────
        $categories = $household->categories()
            ->orderBy('type')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'color', 'icon']);

        // ── Recurring expenses (active templates) ────────────────────────
        $recurringExpenses = $household->recurringExpenses()
            ->with('category:id,name,color,icon')
            ->where('is_active', true)
            ->orderByRaw("FIELD(frequency, 'monthly', 'weekly', 'daily')")
            ->orderBy('description')
            ->get(['id', 'category_id', 'description', 'amount', 'currency', 'frequency', 'starts_at', 'last_generated_at', 'is_active']);

        // Monthly impact: daily*30 + weekly*4.33 + monthly*1
        $monthlyImpact = $recurringExpenses->sum(function (RecurringExpense $re) {
            return match ($re->frequency) {
                'daily'   => (float) $re->amount * 30,
                'weekly'  => (float) $re->amount * 4.33,
                'monthly' => (float) $re->amount,
                default   => 0,
            };
        });

        // ── One-off transactions this month (no recurring_expense_id) ────
        $oneOffThisMonth = $household->transactions()
            ->with('category:id,name,color,icon')
            ->whereNull('recurring_expense_id')
            ->whereYear('transacted_at', $now->year)
            ->whereMonth('transacted_at', $now->month)
            ->latest('transacted_at')
            ->get(['id', 'category_id', 'recurring_expense_id', 'amount', 'currency', 'type', 'description', 'transacted_at']);

        // ── Income transactions this month ────────────────────────────────
        $incomeThisMonth = $household->transactions()
            ->with('category:id,name,color,icon')
            ->where('type', 'income')
            ->whereYear('transacted_at', $now->year)
            ->whereMonth('transacted_at', $now->month)
            ->latest('transacted_at')
            ->get(['id', 'category_id', 'recurring_expense_id', 'amount', 'currency', 'type', 'description', 'transacted_at']);

        // ── Live exchange rate ─────────────────────────────────────────────
        $ngnPerUsd = $fx->ngnPerUsd();

        return Inertia::render('dashboard', [
            'household'          => $household->only('id', 'name'),
            'monthlyIncome'      => (float) $monthlyIncome,
            'monthlyExpenses'    => (float) $monthlyExpenses,
            'netPosition'        => (float) $netPosition,
            'recentTransactions' => $recentTransactions,
            'categories'         => $categories,
            'ngnPerUsd'          => $ngnPerUsd,
            'recurringExpenses'  => $recurringExpenses,
            'monthlyImpact'      => round($monthlyImpact, 2),
            'oneOffThisMonth'    => $oneOffThisMonth,
            'incomeThisMonth'    => $incomeThisMonth,
        ]);
    }
}
