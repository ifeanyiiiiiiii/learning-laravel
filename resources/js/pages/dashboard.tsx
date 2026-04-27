import { Head, router } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    Plus,
    TrendingDown,
    TrendingUp,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string | null;
};

type Transaction = {
    id: number;
    category_id: number | null;
    amount: string;
    currency: 'NGN' | 'USD';
    type: 'income' | 'expense';
    description: string | null;
    transacted_at: string;
    category: Pick<Category, 'id' | 'name' | 'color' | 'icon'> | null;
};

type DashboardProps = {
    household: { id: number; name: string };
    monthlyIncome: number;
    monthlyExpenses: number;
    netPosition: number;
    recentTransactions: Transaction[];
    categories: Category[];
    ngnPerUsd: number;
};



// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNGN(amount: number): string {
    return '₦' + new Intl.NumberFormat('en-NG').format(Math.abs(amount));
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

// ── Add Transaction Modal ─────────────────────────────────────────────────────

function AddTransactionModal({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
    const [form, setForm] = useState({
        type: 'expense' as 'income' | 'expense',
        category_id: '',
        amount: '',
        currency: 'NGN' as 'NGN' | 'USD',
        description: '',
        transacted_at: new Date().toISOString().slice(0, 10),
    });
    const [submitting, setSubmitting] = useState(false);

    const filteredCategories = categories.filter((c) => c.type === form.type);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            '/transactions',
            { ...form, category_id: form.category_id || null, amount: parseFloat(form.amount) },
            { onSuccess: () => onClose(), onFinish: () => setSubmitting(false) },
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zinc-900">Add Transaction</h2>
                    <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-zinc-100">
                        <X className="h-4 w-4 text-zinc-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1">
                        {(['expense', 'income'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, type: t, category_id: '' }))}
                                className={`rounded-xl py-2 text-sm font-semibold capitalize transition ${
                                    form.type === t
                                        ? t === 'expense'
                                            ? 'bg-rose-500 text-white shadow'
                                            : 'bg-emerald-500 text-white shadow'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={form.currency}
                            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as 'NGN' | 'USD' }))}
                            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none"
                        >
                            <option value="NGN">NGN ₦</option>
                            <option value="USD">USD $</option>
                        </select>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={form.amount}
                            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
                        />
                    </div>
                    <select
                        value={form.category_id}
                        onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                    >
                        <option value="">Select category (optional)</option>
                        {filteredCategories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
                    />
                    <input
                        type="date"
                        required
                        value={form.transacted_at}
                        onChange={(e) => setForm((f) => ({ ...f, transacted_at: e.target.value }))}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {submitting ? 'Saving…' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

export default function Dashboard({
    household,
    monthlyIncome,
    monthlyExpenses,
    netPosition,
    recentTransactions,
    categories,
    ngnPerUsd,
}: DashboardProps) {
    const [showModal, setShowModal] = useState(false);
    const month = new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });

    return (
        <>
            <Head title={`${household.name} · Dashboard`} />
            {showModal && <AddTransactionModal categories={categories} onClose={() => setShowModal(false)} />}

            <div className="p-6 sm:p-8">
                    {/* Title */}
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-zinc-950">Dashboard</h1>
                            <p className="mt-0.5 text-sm text-zinc-400">{month}</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {/* Summary cards */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="relative overflow-hidden rounded-2xl bg-zinc-900 p-5 text-white">
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10" />
                            <p className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">Net Position</p>
                            <p className={`mt-1.5 text-2xl font-black tracking-tight ${netPosition >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {netPosition < 0 ? '-' : ''}{formatNGN(netPosition)}
                            </p>
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                                <Wallet className="h-3.5 w-3.5" />Income minus expenses
                            </div>
                        </div>
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                            <p className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">Income</p>
                            <p className="mt-1.5 text-2xl font-black tracking-tight text-emerald-900">{formatNGN(monthlyIncome)}</p>
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
                                <TrendingUp className="h-3.5 w-3.5" />This month
                            </div>
                        </div>
                        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
                            <p className="text-[11px] font-semibold tracking-widest text-rose-600 uppercase">Expenses</p>
                            <p className="mt-1.5 text-2xl font-black tracking-tight text-rose-900">{formatNGN(monthlyExpenses)}</p>
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600">
                                <TrendingDown className="h-3.5 w-3.5" />This month
                            </div>
                        </div>
                    </div>

                    {/* Exchange rate */}
                    <div className="mb-6 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                        <BarChart3 className="h-4 w-4 shrink-0 text-blue-500" />
                        <span className="text-sm text-blue-700">
                            <span className="font-bold">Live rate:</span> 1 USD = ₦{new Intl.NumberFormat('en-NG').format(ngnPerUsd)}
                        </span>
                        <span className="ml-auto text-xs text-blue-400">Updates hourly</span>
                    </div>

                    {/* Transactions */}
                    <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                            <h2 className="text-sm font-bold text-zinc-900">Recent Transactions</h2>
                            <span className="text-xs text-zinc-400">Last 10</span>
                        </div>
                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                                    <Wallet className="h-6 w-6 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-700">No transactions yet</p>
                                <p className="mt-1 text-xs text-zinc-400">Tap "Add" to log your first one</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-zinc-50">
                                {recentTransactions.map((t) => (
                                    <li key={t.id} className="flex items-center gap-4 px-5 py-3.5">
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                            style={{ backgroundColor: (t.category?.color ?? '#6b7280') + '20' }}
                                        >
                                            {t.type === 'income' ? (
                                                <ArrowUpRight className="h-4 w-4" style={{ color: t.category?.color ?? '#6b7280' }} />
                                            ) : (
                                                <ArrowDownLeft className="h-4 w-4" style={{ color: t.category?.color ?? '#6b7280' }} />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-zinc-800">
                                                {t.description ?? t.category?.name ?? 'Transaction'}
                                            </p>
                                            <p className="text-xs text-zinc-400">
                                                {t.category?.name ?? 'Uncategorised'} · {formatDate(t.transacted_at)}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-bold tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}
                                            {t.currency === 'USD' ? '$' : '₦'}
                                            {new Intl.NumberFormat('en-NG').format(parseFloat(t.amount))}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
            </div>
        </>
    );
}
