<?php

namespace App\Http\Controllers;

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
        ]);
    }
}
