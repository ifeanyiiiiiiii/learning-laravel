import { Head, router } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    Filter,
    Plus,
    RefreshCw,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import NairapathLayout from '@/layouts/nairapath-layout';

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

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Filters = {
    type?: string;
    category_id?: string | number;
    month?: string;
    search?: string;
};

type TransactionsProps = {
    transactions: Paginator<Transaction>;
    categories: Category[];
    filters: Filters;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number | string, currency: 'NGN' | 'USD'): string {
    const n = typeof amount === 'string' ? parseFloat(amount) : amount;
    const sym = currency === 'USD' ? '$' : '₦';
    return sym + new Intl.NumberFormat('en-NG').format(Math.abs(n));
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// ── Debounce hook ─────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Transactions({ transactions, categories, filters }: TransactionsProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [categoryId, setCategoryId] = useState(
        filters.category_id ? String(filters.category_id) : '',
    );
    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    const [month, setMonth] = useState(filters.month ?? currentMonth);
    const debouncedSearch = useDebounce(search);

    const isFirstRender = useRef(true);

    // Re-query whenever any filter changes (search is debounced)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const params: Record<string, string> = {};
        if (type) params.type = type;
        if (categoryId) params.category_id = categoryId;
        if (month) params.month = month;
        if (debouncedSearch) params.search = debouncedSearch;

        router.get('/transactions', params, { preserveState: true, replace: true });
    }, [type, categoryId, month, debouncedSearch]);

    function clearFilters() {
        setSearch('');
        setType('');
        setCategoryId('');
        setMonth(currentMonth);
    }

    const hasFilters = !!(type || categoryId || month !== currentMonth || search);
    const totalIncome = transactions.data
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalExpense = transactions.data
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + parseFloat(t.amount), 0);

    return (
        <>
            <Head title="Transactions · NairaPath" />

            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-950">Transactions</h1>
                        <p className="mt-0.5 text-sm text-zinc-400">
                            {transactions.total} total transaction{transactions.total !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <a
                        href="/dashboard"
                        className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </a>
                </div>

                {/* Filter bar — all controls on one wrapping row */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="flex h-9 min-w-40 flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 focus-within:border-emerald-400">
                        <Search className="h-4 w-4 shrink-0 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search description…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-full flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')}>
                                <X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700" />
                            </button>
                        )}
                    </div>

                    {/* Type toggle */}
                    <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
                        {(['', 'income', 'expense'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                                    type === t
                                        ? t === 'income'
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : t === 'expense'
                                              ? 'bg-rose-500 text-white shadow-sm'
                                              : 'bg-zinc-900 text-white shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-800'
                                }`}
                            >
                                {t === '' ? 'All' : t}
                            </button>
                        ))}
                    </div>

                    {/* Category */}
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="h-9 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 focus:border-emerald-400 focus:outline-none"
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Month picker */}
                    <div className="flex h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 focus-within:border-emerald-400">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-transparent text-sm text-zinc-700 focus:outline-none"
                        />
                    </div>

                    {/* Clear all */}
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-semibold text-zinc-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Summary strip (for current page/filter) */}
                {transactions.data.length > 0 && (
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs">
                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">In:</span>
                            <span className="font-bold text-emerald-800">
                                ₦{new Intl.NumberFormat('en-NG').format(totalIncome)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs">
                            <ArrowDownLeft className="h-3.5 w-3.5 text-rose-600" />
                            <span className="text-rose-600">Out:</span>
                            <span className="font-bold text-rose-800">
                                ₦{new Intl.NumberFormat('en-NG').format(totalExpense)}
                            </span>
                        </div>
                        <span className="text-xs text-zinc-400">
                            Showing {transactions.from}–{transactions.to} of {transactions.total}
                        </span>
                    </div>
                )}

                {/* Transaction list */}
                <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
                    {transactions.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            {hasFilters ? (
                                <>
                                    <Filter className="mb-3 h-10 w-10 text-zinc-300" />
                                    <p className="text-sm font-semibold text-zinc-600">No transactions match your filters</p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-3 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-200"
                                    >
                                        Clear filters
                                    </button>
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mb-3 h-10 w-10 text-zinc-300" />
                                    <p className="text-sm font-semibold text-zinc-600">No transactions yet</p>
                                    <p className="mt-1 text-xs text-zinc-400">Go to the dashboard to add your first one</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <ul className="divide-y divide-zinc-50">
                            {transactions.data.map((t) => (
                                <li key={t.id} className="flex items-center gap-4 px-5 py-4">
                                    {/* Icon */}
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: (t.category?.color ?? '#6b7280') + '20',
                                        }}
                                    >
                                        {t.type === 'income' ? (
                                            <ArrowUpRight
                                                className="h-4 w-4"
                                                style={{ color: t.category?.color ?? '#6b7280' }}
                                            />
                                        ) : (
                                            <ArrowDownLeft
                                                className="h-4 w-4"
                                                style={{ color: t.category?.color ?? '#6b7280' }}
                                            />
                                        )}
                                    </div>

                                    {/* Description + meta */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-zinc-800">
                                            {t.description ?? t.category?.name ?? 'Transaction'}
                                        </p>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                                style={{
                                                    backgroundColor: (t.category?.color ?? '#6b7280') + '18',
                                                    color: t.category?.color ?? '#6b7280',
                                                }}
                                            >
                                                {t.category?.name ?? 'Uncategorised'}
                                            </span>
                                            {t.recurring_expense_id && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                                                    <RefreshCw className="h-2.5 w-2.5" />
                                                    Recurring
                                                </span>
                                            )}
                                            <span className="text-xs text-zinc-400">{formatDate(t.transacted_at)}</span>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <span
                                        className={`shrink-0 text-sm font-bold tabular-nums ${
                                            t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                        }`}
                                    >
                                        {t.type === 'income' ? '+' : '-'}
                                        {formatCurrency(t.amount, t.currency)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                        {transactions.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`min-w-[36px] rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    link.active
                                        ? 'bg-zinc-900 text-white'
                                        : link.url
                                          ? 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                          : 'cursor-not-allowed border border-zinc-100 text-zinc-300'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Transactions.layout = (page: React.ReactNode) => <NairapathLayout>{page}</NairapathLayout>;
