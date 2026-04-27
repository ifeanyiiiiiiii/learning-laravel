import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    Tag,
    X,
    ArrowLeftRight,
} from 'lucide-react';
import { useState } from 'react';
import { dashboard } from '@/routes';

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    matchPrefix?: string;
};

const NAV: NavItem[] = [
    { label: 'Dashboard',    href: '/dashboard',    icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight,  matchPrefix: '/transactions' },
    { label: 'Categories',   href: '/categories',   icon: Tag,             matchPrefix: '/categories' },
    { label: 'Settings',     href: '/settings/profile', icon: Settings,    matchPrefix: '/settings' },
];

type PageProps = {
    auth: { user: { name: string; email: string } };
    household: { id: number; name: string } | null;
};

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
        >
            <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
            {item.label}
            {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-emerald-400" />}
        </Link>
    );
}

export default function NairaPathLayout({ children }: { children: React.ReactNode }) {
    const { auth, household } = usePage<PageProps>().props;
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    function isActive(item: NavItem) {
        if (item.matchPrefix) return url.startsWith(item.matchPrefix);
        return url === item.href || url.startsWith(item.href + '?');
    }

    const initials = auth.user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-black text-white">N</div>
                <div>
                    <p className="text-sm font-bold text-zinc-900">{household?.name ?? 'NairaPath'}</p>
                    <p className="text-[11px] text-zinc-400">NairaPath</p>
                </div>
            </div>

            <div className="mx-4 mb-4 h-px bg-zinc-100" />

            {/* Nav */}
            <nav className="flex-1 space-y-0.5 px-3">
                {NAV.map((item) => (
                    <NavLink
                        key={item.href}
                        item={item}
                        active={isActive(item)}
                        onClick={() => setMobileOpen(false)}
                    />
                ))}
            </nav>

            {/* User */}
            <div className="mx-4 mb-4 mt-4 h-px bg-zinc-100" />
            <div className="px-3 pb-5">
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-zinc-900">{auth.user.name}</p>
                        <p className="truncate text-[11px] text-zinc-400">{auth.user.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => router.post('/logout')}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Desktop sidebar */}
            <aside className="hidden w-56 shrink-0 border-r border-zinc-100 bg-white lg:flex lg:flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-zinc-950/40" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-64 border-r border-zinc-100 bg-white shadow-xl">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile topbar */}
                <header className="flex h-14 items-center gap-3 border-b border-zinc-100 bg-white px-4 lg:hidden">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-black text-white">N</div>
                        <span className="text-sm font-bold text-zinc-900">NairaPath</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
