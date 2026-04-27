import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    ChevronRight,
    CircleDollarSign,
    HandCoins,
    PiggyBank,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Wallet,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { dashboard, login, register } from '@/routes';

type WelcomeProps = {
    canRegister?: boolean;
};

type PageProps = {
    auth: {
        user?: { id: number; name: string; email: string };
    };
};

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

const ticker = [
    { value: '2,400+', label: 'Households Served' },
    { value: '1.2M+', label: 'Transactions Logged' },
    { value: 'NGN 3.5B+', label: 'Tracked Monthly' },
    { value: 'Live', label: 'NGN / USD Rates' },
    { value: '< 2 min', label: 'Setup Time' },
    { value: '100%', label: 'Free to Start' },
];

const features = [
    {
        icon: Wallet,
        title: 'Track Every Naira',
        text: 'Log income and expenses the moment they happen. Your money story, always up to date.',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-700',
        bar: 'from-emerald-400 to-teal-400',
    },
    {
        icon: CircleDollarSign,
        title: 'NGN + USD Ready',
        text: 'Manage multi-currency households with live exchange rates baked in.',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-700',
        bar: 'from-blue-400 to-indigo-400',
    },
    {
        icon: PiggyBank,
        title: 'Savings Locks',
        text: 'Set aside funds for school fees, emergencies, and goals � separate from daily spending.',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-700',
        bar: 'from-violet-400 to-purple-400',
    },
    {
        icon: BarChart3,
        title: 'Burn Rate Meter',
        text: 'See exactly how many days your current balance can sustain your household.',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-700',
        bar: 'from-rose-400 to-pink-400',
    },
    {
        icon: TrendingUp,
        title: 'Monthly Reports',
        text: 'Visualize income vs expenses month on month with clean, readable charts.',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
        bar: 'from-amber-400 to-orange-400',
    },
    {
        icon: Zap,
        title: 'Quick Entry',
        text: 'Add a transaction in seconds � no forms, no friction. Just tap and track.',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-700',
        bar: 'from-cyan-400 to-sky-400',
    },
];

const steps = [
    {
        icon: HandCoins,
        label: 'Step One',
        title: 'Create Your Household',
        text: 'Register and name your household in under a minute. Your partner can join the same shared view.',
    },
    {
        icon: Sparkles,
        label: 'Step Two',
        title: 'Record Transactions Daily',
        text: 'Add income, tag expenses by category, and let NairaPath do the calculations.',
    },
    {
        icon: ShieldCheck,
        label: 'Step Three',
        title: 'Review and Protect',
        text: 'Read monthly summaries, protect your savings, and adjust spending habits with confidence.',
    },
];

const activity = [
    { label: 'Grocery – Shoprite', amount: '−₦18,400', color: 'text-rose-600' },
    { label: 'Salary – Husband', amount: '+₦720,000', color: 'text-emerald-600' },
    { label: 'DSTV Subscription', amount: '−₦24,500', color: 'text-rose-600' },
];

export default function Welcome({ canRegister = true }: WelcomeProps) {
    const { auth } = usePage<PageProps>().props;
    const primaryHref = auth.user ? dashboard() : canRegister ? register() : login();
    const primaryText = auth.user ? 'Open Dashboard' : canRegister ? 'Start for Free' : 'Go to Login';

    const featuresRef = useInView();
    const stepsRef = useInView();
    const ctaRef = useInView(0.1);

    return (
        <>
            <Head title="NairaPath | Family Finance Tracker" />

            <style>{`
                @keyframes rise {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(-32px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(32px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.94); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-10px); }
                }
                @keyframes ticker {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes pulse-ring {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
                    60%      { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
                }

                .hero-badge { opacity: 0; animation: rise 0.5s ease-out 0.05s forwards; }
                .hero-text  { opacity: 0; animation: rise 0.6s ease-out 0.15s forwards; }
                .hero-cta   { opacity: 0; animation: rise 0.6s ease-out 0.30s forwards; }
                .hero-trust { opacity: 0; animation: rise 0.6s ease-out 0.45s forwards; }
                .hero-card  { opacity: 0; animation: scaleUp 0.7s ease-out 0.35s forwards; }

                .float-el   { animation: float 6s ease-in-out infinite; }
                .logo-pulse { animation: pulse-ring 2.8s ease-in-out infinite; }

                .ticker-track       { display: flex; width: max-content; animation: ticker 30s linear infinite; }
                .ticker-track:hover { animation-play-state: paused; }

                .sv-rise  { opacity: 0; }
                .sv-left  { opacity: 0; }
                .sv-right { opacity: 0; }
                .sv-scale { opacity: 0; }

                .sv-rise.is-visible  { animation: rise      0.6s ease-out forwards; }
                .sv-left.is-visible  { animation: slideLeft  0.6s ease-out forwards; }
                .sv-right.is-visible { animation: slideRight 0.6s ease-out forwards; }
                .sv-scale.is-visible { animation: scaleUp   0.65s ease-out forwards; }

                .feat-bar { transform-origin: left; transform: scaleX(0); transition: transform 0.35s ease; }
                .feat-card:hover .feat-bar { transform: scaleX(1); }
            `}</style>

            <div className="min-h-screen overflow-x-clip bg-white text-zinc-900">

                {/* -- HEADER -- */}
                <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2.5">
                            <div className="logo-pulse flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-black text-white">
                                N
                            </div>
                            <span className="text-sm font-bold tracking-tight text-zinc-900">NairaPath</span>
                            <span className="hidden text-xs text-zinc-400 sm:inline">Family Finance</span>
                        </div>

                        <nav className="flex items-center gap-1.5">
                            <Link
                                href={login()}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                            >
                                Sign in
                            </Link>
                            {(canRegister || auth.user) && (
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
                                >
                                    {primaryText}
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    {/* -- HERO -- */}
                    <section className="relative isolate overflow-hidden bg-linear-to-b from-zinc-50 via-white to-white pb-24 pt-20 sm:pt-32">
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div className="float-el absolute -top-16 right-1/3 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
                            <div className="float-el absolute top-1/2 -left-20 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" style={{ animationDelay: '2s' }} />
                            <div className="float-el absolute right-10 bottom-0 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl" style={{ animationDelay: '4s' }} />
                        </div>

                        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="hero-badge mb-8 flex max-w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-800">Built for Lagos families � Free to start</span>
                            </div>

                            <div className="grid items-center gap-14 lg:grid-cols-2">
                                <div>
                                    <h1 className="hero-text text-5xl font-black leading-none tracking-tighter text-zinc-950 sm:text-6xl lg:text-7xl">
                                        Know where your
                                        <span className="relative mt-2 block">
                                            <span className="relative z-10 bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                                                money stands.
                                            </span>
                                            <span className="absolute -bottom-1 left-0 z-0 h-5 w-56 rounded-full bg-emerald-100/70 blur-sm sm:w-80" />
                                        </span>
                                    </h1>

                                    <p className="hero-text mt-7 max-w-lg text-lg leading-8 text-zinc-500">
                                        NairaPath gives your household one clear view of income, expenses, savings, and burn rate � in NGN and USD.
                                    </p>

                                    <div className="hero-cta mt-8 flex flex-wrap gap-3">
                                        <Link
                                            href={primaryHref}
                                            className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
                                        >
                                            {primaryText}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                        <Link
                                            href={auth.user ? dashboard() : login()}
                                            className="rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                                        >
                                            See how it works
                                        </Link>
                                    </div>

                                    <div className="hero-trust mt-10 flex flex-wrap items-center gap-5 text-xs text-zinc-400">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                            No credit card required
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Zap className="h-4 w-4 text-emerald-500" />
                                            Setup in under 2 minutes
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <HandCoins className="h-4 w-4 text-emerald-500" />
                                            100% free to start
                                        </span>
                                    </div>
                                </div>

                                {/* App mockup card */}
                                <div className="hero-card relative">
                                    <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-emerald-100 to-cyan-100 opacity-50 blur-2xl" />
                                    <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-2xl shadow-zinc-900/10">
                                        {/* Browser chrome */}
                                        <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                            <span className="mx-auto text-[11px] text-zinc-400">app.nairapath.ng · dashboard</span>
                                        </div>

                                        <div className="p-5 sm:p-6">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div>
                                                    <p className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">Net Position</p>
                                                    <p className="mt-1 text-3xl font-black tracking-tight text-zinc-950">₦629,600</p>
                                                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                        <TrendingUp className="h-3 w-3" />
                                                        +11.3% this month
                                                    </span>
                                                </div>
                                                <div
                                                    className="float-el flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-emerald-400"
                                                    style={{ animationDelay: '1.5s' }}
                                                >
                                                    <BarChart3 className="h-6 w-6" />
                                                </div>
                                            </div>

                                            <div className="mb-4 grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                                    <p className="text-[11px] font-medium text-emerald-600">Monthly Income</p>
                                                    <p className="mt-1 text-lg font-black text-emerald-900">₦1,250,000</p>
                                                    <div className="mt-2.5 h-1 rounded-full bg-emerald-200">
                                                        <div className="h-1 w-3/4 rounded-full bg-emerald-500" />
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                                                    <p className="text-[11px] font-medium text-rose-600">Monthly Expenses</p>
                                                    <p className="mt-1 text-lg font-black text-rose-900">₦620,400</p>
                                                    <div className="mt-2.5 h-1 rounded-full bg-rose-200">
                                                        <div className="h-1 w-1/2 rounded-full bg-rose-500" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">Recent Activity</p>
                                                    <span className="cursor-pointer text-[11px] font-medium text-emerald-600 hover:underline">View all</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {activity.map((t) => (
                                                        <div
                                                            key={t.label}
                                                            className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm"
                                                        >
                                                            <span className="text-xs text-zinc-600">{t.label}</span>
                                                            <span className={`text-xs font-bold ${t.color}`}>{t.amount}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* -- TICKER STRIP -- */}
                    <div className="overflow-hidden border-y border-zinc-100 bg-zinc-50 py-4">
                        <div className="ticker-track">
                            {[...ticker, ...ticker, ...ticker, ...ticker].map((item, i) => (
                                <div key={i} className="mx-8 flex shrink-0 items-center gap-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-xs font-bold text-zinc-900">{item.value}</span>
                                    <span className="text-xs text-zinc-500">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* -- FEATURES -- */}
                    <section className="py-24 sm:py-32">
                        <div ref={featuresRef.ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className={`sv-rise mb-16 text-center ${featuresRef.inView ? 'is-visible' : ''}`}>
                                <p className="mb-3 text-xs font-semibold tracking-widest text-emerald-600 uppercase">Everything you need</p>
                                <h2 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
                                    One app. Full picture.
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-zinc-500">
                                    Stop guessing and switching between spreadsheets. NairaPath gives your household the complete financial view it deserves.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feat, i) => {
                                    const Icon = feat.icon;
                                    return (
                                        <article
                                            key={feat.title}
                                            className={`feat-card sv-rise relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${featuresRef.inView ? 'is-visible' : ''}`}
                                            style={{ animationDelay: featuresRef.inView ? `${i * 0.08}s` : undefined }}
                                        >
                                            <div className={`mb-4 inline-flex rounded-xl p-2.5 ${feat.iconBg}`}>
                                                <Icon className={`h-5 w-5 ${feat.iconColor}`} />
                                            </div>
                                            <h3 className="mb-2 text-base font-bold text-zinc-900">{feat.title}</h3>
                                            <p className="text-sm leading-7 text-zinc-500">{feat.text}</p>
                                            <div className={`feat-bar absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${feat.bar}`} />
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* -- HOW IT WORKS -- */}
                    <section className="bg-zinc-950 py-24 text-white sm:py-32">
                        <div ref={stepsRef.ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className={`sv-rise mb-16 ${stepsRef.inView ? 'is-visible' : ''}`}>
                                <p className="mb-3 text-xs font-semibold tracking-widest text-emerald-400 uppercase">How it works</p>
                                <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                                    Up and running in three steps.
                                </h2>
                            </div>

                            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                                <div>
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        return (
                                            <div
                                                key={step.title}
                                                className={`sv-left ${stepsRef.inView ? 'is-visible' : ''} relative flex gap-5 pb-10 last:pb-0`}
                                                style={{ animationDelay: stepsRef.inView ? `${index * 0.15}s` : undefined }}
                                            >
                                                {index < steps.length - 1 && (
                                                    <div className="absolute top-14 left-6 bottom-0 w-0.5 bg-linear-to-b from-emerald-500/40 to-transparent" />
                                                )}
                                                <div className="relative shrink-0">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-black text-zinc-300 ring-2 ring-zinc-950">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">{step.label}</p>
                                                    <h3 className="mt-1 text-xl font-bold text-white">{step.title}</h3>
                                                    <p className="mt-2 max-w-sm text-sm leading-7 text-zinc-400">{step.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div
                                    className={`sv-right ${stepsRef.inView ? 'is-visible' : ''} relative overflow-hidden rounded-3xl`}
                                    style={{ animationDelay: stepsRef.inView ? '0.35s' : undefined }}
                                >
                                    <img
                                        src="/images/landing/steps-left.jpg"
                                        alt="Hands working with a calculator on a desk"
                                        className="h-full max-h-96 w-full object-cover lg:max-h-none"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-5 left-5 right-5">
                                        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                            <span className="text-sm font-semibold text-white">Your data stays private</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* -- CTA -- */}
                    <section ref={ctaRef.ref} className="relative isolate overflow-hidden py-32 sm:py-40">
                        <img
                            src="/images/landing/cta-bg.jpg"
                            alt="Modern desk workspace"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-zinc-950/65" />
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-950/50 via-transparent to-cyan-950/30" />

                        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                            <div className={`sv-scale ${ctaRef.inView ? 'is-visible' : ''}`}>
                                <p className="mb-4 text-xs font-semibold tracking-widest text-emerald-400 uppercase">Ready to take control</p>
                                <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
                                    Your household deserves
                                    <span className="mt-1 block text-emerald-400">financial clarity.</span>
                                </h2>
                                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-300">
                                    Join thousands of Lagos families who track income, protect savings, and move toward financial goals � one transaction at a time.
                                </p>
                                <div className="mt-10 flex flex-wrap justify-center gap-4">
                                    <Link
                                        href={primaryHref}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
                                    >
                                        {primaryText}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                                    >
                                        Sign in to account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* -- FOOTER -- */}
                    <footer className="border-t border-zinc-100 bg-white py-10">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 lg:px-8">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-[11px] font-black text-white">N</div>
                                <span className="text-sm font-bold text-zinc-900">NairaPath</span>
                                <span className="text-sm text-zinc-400">· Family Finance Tracker</span>
                            </div>
                            <p className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} NairaPath. Built for Lagos families.</p>
                            <div className="flex items-center gap-6 text-xs text-zinc-500">
                                <Link href={login()} className="transition hover:text-zinc-900">Sign in</Link>
                                {canRegister && (
                                    <Link href={register()} className="transition hover:text-zinc-900">Register</Link>
                                )}
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
