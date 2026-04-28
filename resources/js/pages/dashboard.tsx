import { Head, router } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    ChevronRight,
    Pause,
    PiggyBank,
    Play,
    Plus,
    RefreshCw,
    Trash2,
    TrendingUp,
    Wallet,
    X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

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
    recurring_expense_id: number | null;
    amount: string;
    currency: 'NGN' | 'USD';
    type: 'income' | 'expense';
    description: string | null;
    transacted_at: string;
    category: Pick<Category, 'id' | 'name' | 'color' | 'icon'> | null;
};

type RecurringExpense = {
    id: number;
    category_id: number | null;
    description: string;
    amount: string;
    currency: 'NGN' | 'USD';
    frequency: 'daily' | 'weekly' | 'monthly';
    starts_at: string;
    last_generated_at: string | null;
    is_active: boolean;
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
    recurringExpenses: RecurringExpense[];
    monthlyImpact: number;
    oneOffThisMonth: Transaction[];
    incomeThisMonth: Transaction[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNGN(amount: number): string {
    return '₦' + new Intl.NumberFormat('en-NG').format(Math.abs(amount));
}

function formatCurrency(amount: number | string, currency: 'NGN' | 'USD'): string {
    const n = typeof amount === 'string' ? parseFloat(amount) : amount;
    const sym = currency === 'USD' ? '$' : '₦';
    return sym + new Intl.NumberFormat('en-NG').format(Math.abs(n));
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

// ── Tab: Income ───────────────────────────────────────────────────────────────

type IncomeSource = { label: string; amount: string; currency: 'NGN' | 'USD' };

function IncomeTab({ onClose }: { onClose: () => void }) {
    const [sources, setSources] = useState<IncomeSource[]>([{ label: 'Salary', amount: '', currency: 'NGN' }]);
    const [submitting, setSubmitting] = useState(false);

    const total = sources.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

    function updateSource(i: number, field: keyof IncomeSource, value: string) {
        setSources((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
    }

    function addSource() {
        setSources((prev) => [...prev, { label: '', amount: '', currency: 'NGN' }]);
    }

    function removeSource(i: number) {
        setSources((prev) => prev.filter((_, idx) => idx !== i));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const valid = sources.filter((s) => s.label.trim() && parseFloat(s.amount) > 0);
        if (!valid.length) return;
        setSubmitting(true);

        let done = 0;
        valid.forEach((s) => {
            router.post(
                '/transactions',
                {
                    type: 'income',
                    description: s.label,
                    amount: parseFloat(s.amount),
                    currency: s.currency,
                    category_id: null,
                    transacted_at: new Date().toISOString().slice(0, 10),
                },
                {
                    onSuccess: () => {
                        done++;
                        if (done === valid.length) onClose();
                    },
                    onFinish: () => {
                        if (done === valid.length) setSubmitting(false);
                    },
                    preserveScroll: true,
                },
            );
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-500">Add your income sources for this month.</p>
            <div className="space-y-3">
                {sources.map((s, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Label (e.g. Salary)"
                            value={s.label}
                            onChange={(e) => updateSource(i, 'label', e.target.value)}
                            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
                        />
                        <select
                            value={s.currency}
                            onChange={(e) => updateSource(i, 'currency', e.target.value)}
                            className="rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2.5 text-sm text-zinc-700 focus:outline-none"
                        >
                            <option value="NGN">₦</option>
                            <option value="USD">$</option>
                        </select>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={s.amount}
                            onChange={(e) => updateSource(i, 'amount', e.target.value)}
                            className="w-28 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
                        />
                        {sources.length > 1 && (
                            <button type="button" onClick={() => removeSource(i)} className="rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-rose-500">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addSource}
                className="flex items-center gap-1.5 rounded-xl border border-dashed border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
            >
                <Plus className="h-3.5 w-3.5" /> Add another source
            </button>
            {total > 0 && (
                <div className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm">
                    <span className="text-emerald-600">Total: </span>
                    <span className="font-black text-emerald-800">{formatNGN(total)}</span>
                </div>
            )}
            <button
                type="submit"
                disabled={submitting || total === 0}
                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
                {submitting ? 'Saving…' : 'Save Income'}
            </button>
        </form>
    );
}

// ── Tab: Recurring Expense ────────────────────────────────────────────────────

function RecurringTab({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
    const expenseCategories = categories.filter((c) => c.type === 'expense');
    const [form, setForm] = useState({
        description: '',
        amount: '',
        currency: 'NGN' as 'NGN' | 'USD',
        frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
        starts_at: new Date().toISOString().slice(0, 10),
        category_id: '',
    });
    const [submitting, setSubmitting] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            '/recurring-expenses',
            { ...form, category_id: form.category_id || null, amount: parseFloat(form.amount) },
            { onSuccess: () => onClose(), onFinish: () => setSubmitting(false) },
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-500">Create a recurring expense template. Transactions are auto-generated daily.</p>
            <input
                type="text"
                placeholder="Description (e.g. Rent)"
                required
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
            />
            <div className="flex gap-2">
                <select
                    value={form.currency}
                    onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as 'NGN' | 'USD' }))}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 focus:outline-none"
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
                    className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
                />
            </div>
            <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
            >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
            </select>
            <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
            >
                <option value="">Category (optional)</option>
                {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <div>
                <label className="mb-1 block text-xs text-zinc-500">Start date</label>
                <input
                    type="date"
                    required
                    value={form.starts_at}
                    onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
                {submitting ? 'Saving…' : 'Create Recurring Expense'}
            </button>
        </form>
    );
}

// ── Tab: One-off ──────────────────────────────────────────────────────────────

function OneOffTab({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-500">Log a one-time or emergency transaction.</p>
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
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 focus:outline-none"
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
                    className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
                />
            </div>
            <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
            >
                <option value="">Category (optional)</option>
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
                className="w-full rounded-2xl bg-rose-500 py-3.5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
            >
                {submitting ? 'Saving…' : 'Save Transaction'}
            </button>
        </form>
    );
}

// ── Add Modal (3 tabs) ────────────────────────────────────────────────────────

type ModalTab = 'income' | 'recurring' | 'oneoff';

function AddModal({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
    const [tab, setTab] = useState<ModalTab>('income');

    const tabs: { key: ModalTab; label: string }[] = [
        { key: 'income', label: 'Income' },
        { key: 'recurring', label: 'Recurring' },
        { key: 'oneoff', label: 'One-off' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zinc-900">Add</h2>
                    <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-zinc-100">
                        <X className="h-4 w-4 text-zinc-500" />
                    </button>
                </div>

                {/* Tab switcher */}
                <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl bg-zinc-100 p-1">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTab(key)}
                            className={`rounded-xl py-2 text-sm font-semibold transition ${
                                tab === key ? 'bg-white text-zinc-900 shadow' : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'income' && <IncomeTab onClose={onClose} />}
                {tab === 'recurring' && <RecurringTab categories={categories} onClose={onClose} />}
                {tab === 'oneoff' && <OneOffTab categories={categories} onClose={onClose} />}
            </div>
        </div>
    );
}

// ── Recurring Expense Row ─────────────────────────────────────────────────────

function RecurringRow({ re }: { re: RecurringExpense }) {
    function toggleActive() {
        router.patch(`/recurring-expenses/${re.id}`, { is_active: !re.is_active }, { preserveScroll: true });
    }

    function handleDelete() {
        if (!confirm(`Delete "${re.description}"? Existing transactions will remain.`)) return;
        router.delete(`/recurring-expenses/${re.id}`, { preserveScroll: true });
    }

    return (
        <li className="flex items-center gap-3 px-5 py-3.5">
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: (re.category?.color ?? '#f59e0b') + '20' }}
            >
                <RefreshCw className="h-4 w-4" style={{ color: re.category?.color ?? '#f59e0b' }} />
            </div>
            <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${re.is_active ? 'text-zinc-800' : 'text-zinc-400 line-through'}`}>
                    {re.description}
                </p>
                <p className="text-xs text-zinc-400">
                    {re.category?.name ?? 'Uncategorised'} · <span className="capitalize">{re.frequency}</span>
                </p>
            </div>
            <span className="text-sm font-bold tabular-nums text-rose-600">
                -{formatCurrency(re.amount, re.currency)}
            </span>
            <button
                onClick={toggleActive}
                title={re.is_active ? 'Pause' : 'Resume'}
                className="ml-1 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
                {re.is_active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
                onClick={handleDelete}
                title="Delete"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-500"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </li>
    );
}

// ── Shared Modal Shell ────────────────────────────────────────────────────────

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
                <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
                    <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-zinc-100">
                        <X className="h-4 w-4 text-zinc-500" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
}

// ── Net Position Detail Modal ─────────────────────────────────────────────────

function NetDetailModal({
    monthlyIncome,
    monthlyExpenses,
    netPosition,
    onClose,
}: {
    monthlyIncome: number;
    monthlyExpenses: number;
    netPosition: number;
    onClose: () => void;
}) {
    const maxVal = Math.max(monthlyIncome, monthlyExpenses, 1);
    const savingsRate =
        monthlyIncome > 0
            ? Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100))
            : 0;

    return (
        <ModalShell title="Net Position" onClose={onClose}>
            <div className="space-y-5">
                <div className="rounded-2xl bg-zinc-900 p-6 text-center">
                    <p className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">This Month</p>
                    <p className={`mt-2 text-4xl font-black ${netPosition >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {netPosition < 0 ? '-' : ''}{formatNGN(netPosition)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">Income minus all expenses</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-emerald-600">Income</span>
                            <span className="font-bold text-emerald-800">{formatNGN(monthlyIncome)}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                            <div
                                className="h-3 rounded-full bg-emerald-500"
                                style={{ width: `${(monthlyIncome / maxVal) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-rose-600">Expenses</span>
                            <span className="font-bold text-rose-800">{formatNGN(monthlyExpenses)}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                            <div
                                className="h-3 rounded-full bg-rose-500"
                                style={{ width: `${(monthlyExpenses / maxVal) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
                {monthlyIncome > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm">
                        <span className="text-zinc-500">Savings rate</span>
                        <span className="font-bold text-zinc-800">{savingsRate}%</span>
                    </div>
                )}
            </div>
        </ModalShell>
    );
}

// ── Income Detail Modal ───────────────────────────────────────────────────────

function IncomeDetailModal({
    monthlyIncome,
    incomeThisMonth,
    onClose,
}: {
    monthlyIncome: number;
    incomeThisMonth: Transaction[];
    onClose: () => void;
}) {
    return (
        <ModalShell title="Income This Month" onClose={onClose}>
            <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">Total</p>
                    <p className="mt-1 text-3xl font-black text-emerald-900">{formatNGN(monthlyIncome)}</p>
                    <p className="mt-1 text-xs text-emerald-500">
                        {incomeThisMonth.length} transaction{incomeThisMonth.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {incomeThisMonth.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-400">No income recorded this month</p>
                ) : (
                    <ul className="divide-y divide-zinc-50 overflow-hidden rounded-2xl border border-zinc-100 bg-white">
                        {incomeThisMonth.map((t) => (
                            <li key={t.id} className="flex items-center gap-3 px-4 py-3.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-zinc-800">
                                        {t.description ?? t.category?.name ?? 'Income'}
                                    </p>
                                    <p className="text-xs text-zinc-400">{formatDate(t.transacted_at)}</p>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">
                                    +{formatCurrency(t.amount, t.currency)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ModalShell>
    );
}

// ── Recurring Detail Modal ────────────────────────────────────────────────────

function RecurringDetailModal({
    recurringExpenses,
    monthlyImpact,
    onClose,
}: {
    recurringExpenses: RecurringExpense[];
    monthlyImpact: number;
    onClose: () => void;
}) {
    const groups = {
        monthly: recurringExpenses.filter((r) => r.frequency === 'monthly'),
        weekly: recurringExpenses.filter((r) => r.frequency === 'weekly'),
        daily: recurringExpenses.filter((r) => r.frequency === 'daily'),
    };

    return (
        <ModalShell title="Recurring Expenses" onClose={onClose}>
            <div className="space-y-4">
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
                    <p className="text-[11px] font-semibold tracking-widest text-rose-600 uppercase">Monthly Impact</p>
                    <p className="mt-1 text-3xl font-black text-rose-900">{formatNGN(monthlyImpact)}</p>
                    <p className="mt-1 text-xs text-rose-500">
                        {recurringExpenses.length} active template{recurringExpenses.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {recurringExpenses.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-400">No recurring expenses yet</p>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white">
                        {(['monthly', 'weekly', 'daily'] as const).map((freq) =>
                            groups[freq].length > 0 ? (
                                <div key={freq}>
                                    <div className="border-b border-zinc-50 bg-zinc-50/60 px-5 py-1.5">
                                        <span className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
                                            {freq}
                                        </span>
                                    </div>
                                    <ul className="divide-y divide-zinc-50">
                                        {groups[freq].map((re) => (
                                            <RecurringRow key={re.id} re={re} />
                                        ))}
                                    </ul>
                                </div>
                            ) : null,
                        )}
                    </div>
                )}
            </div>
        </ModalShell>
    );
}

// ── One-off Detail Modal ─────────────────────────────────────────────────────

function OneOffDetailModal({
    oneOffThisMonth,
    onClose,
}: {
    oneOffThisMonth: Transaction[];
    onClose: () => void;
}) {
    const totalExpense = oneOffThisMonth
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalIncome = oneOffThisMonth
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <ModalShell title="One-off This Month" onClose={onClose}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                        <p className="text-[11px] font-semibold tracking-widest text-rose-600 uppercase">Spent</p>
                        <p className="mt-1 text-xl font-black text-rose-900">{formatNGN(totalExpense)}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">Received</p>
                        <p className="mt-1 text-xl font-black text-emerald-900">{formatNGN(totalIncome)}</p>
                    </div>
                </div>
                {oneOffThisMonth.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-400">No one-off transactions this month</p>
                ) : (
                    <ul className="divide-y divide-zinc-50 overflow-hidden rounded-2xl border border-zinc-100 bg-white">
                        {oneOffThisMonth.map((t) => (
                            <li key={t.id} className="flex items-center gap-3 px-4 py-3.5">
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
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
                                    {formatCurrency(t.amount, t.currency)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ModalShell>
    );
}

// ── Savings Modal (placeholder) ───────────────────────────────────────────────

function SavingsModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalShell title="Savings Goals" onClose={onClose}>
            <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                    <PiggyBank className="h-8 w-8 text-violet-500" />
                </div>
                <p className="text-base font-bold text-zinc-800">Coming soon</p>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                    Set targets for school fees, emergencies, and big purchases — and track progress as you save.
                </p>
                <button
                    disabled
                    className="mt-6 cursor-not-allowed rounded-2xl bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-400"
                >
                    Create a Plan — Coming Soon
                </button>
            </div>
        </ModalShell>
    );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

type DetailModal = 'net' | 'income' | 'recurring' | 'oneoff' | 'savings';

export default function Dashboard({
    household,
    monthlyIncome,
    monthlyExpenses,
    netPosition,
    recentTransactions,
    categories,
    ngnPerUsd,
    recurringExpenses,
    monthlyImpact,
    oneOffThisMonth,
    incomeThisMonth,
}: DashboardProps) {
    const [showModal, setShowModal] = useState(false);
    const [detailModal, setDetailModal] = useState<DetailModal | null>(null);
    const month = new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });

    const frequencyGroups: Record<'monthly' | 'weekly' | 'daily', RecurringExpense[]> = {
        monthly: recurringExpenses.filter((r) => r.frequency === 'monthly'),
        weekly: recurringExpenses.filter((r) => r.frequency === 'weekly'),
        daily: recurringExpenses.filter((r) => r.frequency === 'daily'),
    };

    return (
        <>
            <Head title={`${household.name} · Dashboard`} />
            {showModal && <AddModal categories={categories} onClose={() => setShowModal(false)} />}
            {detailModal === 'net' && (
                <NetDetailModal
                    monthlyIncome={monthlyIncome}
                    monthlyExpenses={monthlyExpenses}
                    netPosition={netPosition}
                    onClose={() => setDetailModal(null)}
                />
            )}
            {detailModal === 'income' && (
                <IncomeDetailModal
                    monthlyIncome={monthlyIncome}
                    incomeThisMonth={incomeThisMonth}
                    onClose={() => setDetailModal(null)}
                />
            )}
            {detailModal === 'recurring' && (
                <RecurringDetailModal
                    recurringExpenses={recurringExpenses}
                    monthlyImpact={monthlyImpact}
                    onClose={() => setDetailModal(null)}
                />
            )}
            {detailModal === 'oneoff' && (
                <OneOffDetailModal
                    oneOffThisMonth={oneOffThisMonth}
                    onClose={() => setDetailModal(null)}
                />
            )}
            {detailModal === 'savings' && (
                <SavingsModal onClose={() => setDetailModal(null)} />
            )}

            <div className="p-6 sm:p-8">
                {/* Header */}
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

                {/* Live rate banner */}
                <div className="mb-6 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <BarChart3 className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-sm text-blue-700">
                        <span className="font-bold">Live rate:</span> 1 USD = ₦{new Intl.NumberFormat('en-NG').format(ngnPerUsd)}
                    </span>
                    <span className="ml-auto text-xs text-blue-400">Updates hourly</span>
                </div>

                {/* Row 1: Summary stat cards */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => setDetailModal('net')}
                        className="relative overflow-hidden rounded-2xl bg-zinc-900 p-5 text-left text-white transition hover:bg-zinc-800"
                    >
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10" />
                        <p className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">Net Position</p>
                        <p className={`mt-1.5 text-2xl font-black tracking-tight ${netPosition >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {netPosition < 0 ? '-' : ''}{formatNGN(netPosition)}
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                            <Wallet className="h-3.5 w-3.5" /> Income minus expenses
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDetailModal('income')}
                        className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-left transition hover:bg-emerald-100"
                    >
                        <p className="text-[11px] font-semibold tracking-widest text-emerald-600 uppercase">Income</p>
                        <p className="mt-1.5 text-2xl font-black tracking-tight text-emerald-900">{formatNGN(monthlyIncome)}</p>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" /> This month
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDetailModal('recurring')}
                        className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-left transition hover:bg-rose-100"
                    >
                        <p className="text-[11px] font-semibold tracking-widest text-rose-600 uppercase">Recurring Impact</p>
                        <p className="mt-1.5 text-2xl font-black tracking-tight text-rose-900">{formatNGN(monthlyImpact)}</p>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600">
                            <RefreshCw className="h-3.5 w-3.5" /> {recurringExpenses.length} active template{recurringExpenses.length !== 1 ? 's' : ''}
                        </div>
                    </button>
                </div>

                {/* Row 2: Section cards — compact, side-by-side, each opens a detail modal */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                    {/* Recurring */}
                    <button
                        type="button"
                        onClick={() => setDetailModal('recurring')}
                        className="group flex flex-col rounded-2xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                                <RefreshCw className="h-4 w-4 text-amber-600" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-300 transition group-hover:text-zinc-500" />
                        </div>
                        <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">Recurring</p>
                        <p className="mt-1 text-base font-black tracking-tight text-zinc-900">
                            {formatNGN(monthlyImpact)}
                            <span className="ml-0.5 text-[11px] font-medium text-zinc-400">/mo</span>
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                            {recurringExpenses.length} template{recurringExpenses.length !== 1 ? 's' : ''}
                        </p>
                    </button>

                    {/* One-off */}
                    <button
                        type="button"
                        onClick={() => setDetailModal('oneoff')}
                        className="group flex flex-col rounded-2xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                <Wallet className="h-4 w-4 text-blue-600" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-300 transition group-hover:text-zinc-500" />
                        </div>
                        <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">One-off</p>
                        <p className="mt-1 text-base font-black tracking-tight text-zinc-900">
                            {oneOffThisMonth.length}
                            <span className="ml-1 text-[11px] font-medium text-zinc-400">this month</span>
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                            {oneOffThisMonth.length === 0 ? 'No transactions' : 'Tap to view all'}
                        </p>
                    </button>

                    {/* Savings */}
                    <button
                        type="button"
                        onClick={() => setDetailModal('savings')}
                        className="group flex flex-col rounded-2xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                                <PiggyBank className="h-4 w-4 text-violet-600" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-300 transition group-hover:text-zinc-500" />
                        </div>
                        <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">Savings</p>
                        <p className="mt-1 text-base font-black tracking-tight text-zinc-900">0 goals</p>
                        <p className="mt-1 text-xs text-zinc-400">Coming soon</p>
                    </button>
                </div>

                {/* Recent transactions feed */}
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
                                        {formatCurrency(t.amount, t.currency)}
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

