import { Head, router, useForm } from '@inertiajs/react';
import {
    ChevronDown,
    Pencil,
    Plus,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import NairapathLayout from '@/layouts/nairapath-layout';

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = {
    id: number;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string | null;
    transactions_count: number;
};

type CategoriesProps = {
    categories: Category[];
};

// ── Colour palette ─────────────────────────────────────────────────────────────

const COLOURS = [
    '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444',
    '#f97316', '#eab308', '#64748b', '#3b82f6', '#ec4899',
    '#a855f7', '#14b8a6', '#0ea5e9', '#84cc16', '#f43f5e',
    '#6366f1', '#d97706', '#059669', '#dc2626', '#7c3aed',
];

// ── Icon list (lucide names used in the app) ────────────────────────────────

const ICONS = [
    'briefcase', 'store', 'building-2', 'trending-up', 'shopping-cart',
    'home', 'car', 'zap', 'graduation-cap', 'heart-pulse',
    'tv-2', 'shirt', 'monitor-play', 'utensils', 'plane',
    'gift', 'music', 'dumbbell', 'coffee', 'wifi',
    'phone', 'book', 'baby', 'paw-print', 'wrench',
];

// ── Colour swatch ──────────────────────────────────────────────────────────────

function ColourPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2">
            {COLOURS.map((c) => (
                <button
                    key={c}
                    type="button"
                    onClick={() => onChange(c)}
                    className={`h-7 w-7 rounded-lg transition hover:scale-110 ${value === c ? 'ring-2 ring-offset-1 ring-zinc-900' : ''}`}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>
    );
}

// ── Icon picker ────────────────────────────────────────────────────────────────

function IconPicker({ value, onChange }: { value: string; onChange: (i: string) => void }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {ICONS.map((icon) => (
                <button
                    key={icon}
                    type="button"
                    onClick={() => onChange(icon)}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-medium transition ${
                        value === icon
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
                    }`}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
}

// ── Category form (shared for add + edit) ─────────────────────────────────────

type CategoryFormData = {
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
};

function CategoryForm({
    initial,
    onSubmit,
    onCancel,
    submitLabel,
    lockType,
}: {
    initial: CategoryFormData;
    onSubmit: (data: CategoryFormData) => void;
    onCancel: () => void;
    submitLabel: string;
    lockType?: boolean;
}) {
    const { data, setData, processing } = useForm<CategoryFormData>(initial);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    maxLength={255}
                    required
                    placeholder="e.g. Groceries"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                />
            </div>

            {/* Type */}
            {!lockType && (
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Type</label>
                    <div className="flex gap-2">
                        {(['income', 'expense'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setData('type', t)}
                                className={`flex-1 rounded-xl border py-2.5 text-xs font-bold capitalize transition ${
                                    data.type === t
                                        ? t === 'income'
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : 'border-rose-500 bg-rose-500 text-white'
                                        : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-400'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colour */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Colour</label>
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="h-8 w-8 rounded-lg border border-zinc-200 shrink-0"
                        style={{ backgroundColor: data.color }}
                    />
                    <span className="text-xs text-zinc-500 font-mono">{data.color}</span>
                </div>
                <ColourPicker value={data.color} onChange={(c) => setData('color', c)} />
            </div>

            {/* Icon */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Icon tag</label>
                <IconPicker value={data.icon} onChange={(i) => setData('icon', i)} />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:opacity-50"
                >
                    {submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Categories({ categories }: CategoriesProps) {
    const [showAdd, setShowAdd] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [tab, setTab] = useState<'expense' | 'income'>('expense');

    const income = categories.filter((c) => c.type === 'income');
    const expense = categories.filter((c) => c.type === 'expense');
    const shown = tab === 'income' ? income : expense;

    function handleAdd(data: CategoryFormData) {
        router.post('/categories', data, {
            onSuccess: () => setShowAdd(false),
        });
    }

    function handleEdit(cat: Category, data: CategoryFormData) {
        router.patch(`/categories/${cat.id}`, data, {
            onSuccess: () => setEditId(null),
        });
    }

    function handleDelete(cat: Category) {
        router.delete(`/categories/${cat.id}`, {
            onSuccess: () => setDeleteId(null),
            onError: () => setDeleteId(null),
        });
    }

    return (
        <>
            <Head title="Categories · NairaPath" />

            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-950">Categories</h1>
                        <p className="mt-0.5 text-sm text-zinc-400">
                            {income.length} income · {expense.length} expense
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setShowAdd(true); setEditId(null); }}
                        className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                        <Plus className="h-4 w-4" />
                        New category
                    </button>
                </div>

                {/* Add form */}
                {showAdd && (
                    <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-bold text-zinc-800">New Category</h2>
                        <CategoryForm
                            initial={{ name: '', type: 'expense', color: '#10b981', icon: '' }}
                            onSubmit={handleAdd}
                            onCancel={() => setShowAdd(false)}
                            submitLabel="Create"
                        />
                    </div>
                )}

                {/* Tab toggle */}
                <div className="mb-4 flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 w-fit">
                    {(['expense', 'income'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition ${
                                tab === t
                                    ? t === 'income'
                                        ? 'bg-emerald-500 text-white shadow-sm'
                                        : 'bg-rose-500 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            {t} ({t === 'income' ? income.length : expense.length})
                        </button>
                    ))}
                </div>

                {/* Category grid */}
                {shown.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
                        <Tag className="mb-3 h-10 w-10 text-zinc-300" />
                        <p className="text-sm font-semibold text-zinc-600">No {tab} categories yet</p>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="mt-3 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-200"
                        >
                            Add one
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {shown.map((cat) => (
                            <div key={cat.id} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
                                {/* Colour bar */}
                                <div className="h-1.5 w-full" style={{ backgroundColor: cat.color }} />

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        {/* Icon + name */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                                                style={{ backgroundColor: cat.color }}
                                            >
                                                {cat.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-zinc-900">{cat.name}</p>
                                                <p className="text-xs text-zinc-400">
                                                    {cat.transactions_count} transaction{cat.transactions_count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => { setEditId(editId === cat.id ? null : cat.id); setShowAdd(false); }}
                                                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteId(cat.id)}
                                                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Inline edit form */}
                                    {editId === cat.id && (
                                        <div className="mt-4 border-t border-zinc-100 pt-4">
                                            <CategoryForm
                                                initial={{ name: cat.name, type: cat.type, color: cat.color, icon: cat.icon ?? '' }}
                                                onSubmit={(data) => handleEdit(cat, data)}
                                                onCancel={() => setEditId(null)}
                                                submitLabel="Save"
                                                lockType
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete confirm modal */}
            {deleteId !== null && (() => {
                const cat = categories.find((c) => c.id === deleteId)!;
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="mb-4 flex items-start justify-between">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                                    style={{ backgroundColor: cat.color }}
                                >
                                    {cat.name.charAt(0).toUpperCase()}
                                </div>
                                <button type="button" onClick={() => setDeleteId(null)}>
                                    <X className="h-5 w-5 text-zinc-400 hover:text-zinc-700" />
                                </button>
                            </div>
                            <h3 className="text-base font-bold text-zinc-900">Delete "{cat.name}"?</h3>
                            {cat.transactions_count > 0 ? (
                                <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                                    This category has {cat.transactions_count} transaction{cat.transactions_count !== 1 ? 's' : ''} linked to it and cannot be deleted.
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-zinc-500">
                                    This will permanently remove the category. This cannot be undone.
                                </p>
                            )}
                            <div className="mt-5 flex gap-2">
                                {cat.transactions_count === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(cat)}
                                        className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50"
                                >
                                    {cat.transactions_count > 0 ? 'OK' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}

Categories.layout = (page: React.ReactNode) => <NairapathLayout>{page}</NairapathLayout>;
