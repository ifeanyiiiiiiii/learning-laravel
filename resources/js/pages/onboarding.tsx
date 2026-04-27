import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Building2, CheckCircle2, House, Sparkles, Users } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/actions/App/Http/Controllers/OnboardingController';

const hints = [
    { icon: Building2, title: 'Your financial home base', text: 'All income, expenses, and savings live under this household.' },
    { icon: Users, title: 'Family-ready by design', text: 'Start solo, invite your partner or family later.' },
    { icon: Sparkles, title: 'Keep the name natural', text: '"The Adeyemi Family" or "My Money Hub" — anything meaningful works.' },
];

export default function Onboarding() {
    return (
        <>
            <Head title="Set up your household · NairaPath" />

            <style>{`
                @keyframes rise {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(28px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-8px); }
                }
                @keyframes pulse-ring {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
                    60%      { box-shadow: 0 0 0 10px rgba(52,211,153,0); }
                }

                .ob-left  { opacity: 0; animation: rise       0.6s ease-out 0.05s forwards; }
                .ob-right { opacity: 0; animation: slideRight 0.65s ease-out 0.2s  forwards; }
                .ob-hint  { opacity: 0; animation: rise       0.5s ease-out forwards; }

                .float-el   { animation: float 6s ease-in-out infinite; }
                .logo-pulse { animation: pulse-ring 2.8s ease-in-out infinite; }
            `}</style>

            <div className="min-h-svh bg-zinc-50 text-zinc-900">

                {/* Top bar */}
                <div className="flex h-14 items-center border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="logo-pulse flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-[11px] font-black text-white">
                            N
                        </div>
                        <span className="text-sm font-bold text-zinc-900">NairaPath</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs text-zinc-400">
                        <span className="hidden sm:inline">Account created</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold text-zinc-600">Step 1 of 2</span>
                    </div>
                </div>

                <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-7xl gap-0 lg:grid-cols-[1fr_1fr]">

                    {/* LEFT PANEL */}
                    <div className="ob-left relative flex flex-col justify-between overflow-hidden bg-zinc-950 p-8 text-white sm:p-12 lg:p-14">
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div className="float-el absolute -top-10 -right-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                            <div className="float-el absolute bottom-10 -left-10 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl" style={{ animationDelay: '3s' }} />
                        </div>

                        <div className="relative">
                            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                                Household setup
                            </p>
                            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                                Name the home your
                                <span className="mt-1 block bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                    finances live in.
                                </span>
                            </h1>
                            <p className="mt-5 max-w-md text-base leading-8 text-zinc-400">
                                Your household is the central space where every naira you earn, spend, or save gets tracked and understood.
                            </p>
                            <div className="mt-8 flex items-center gap-2">
                                <div className="h-2 w-8 rounded-full bg-emerald-500" />
                                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                            </div>
                        </div>

                        <div className="relative mt-12 space-y-3">
                            {hints.map((hint, i) => {
                                const Icon = hint.icon;
                                return (
                                    <div
                                        key={hint.title}
                                        className="ob-hint flex items-start gap-4 rounded-2xl border border-white/8 bg-white/5 p-4"
                                        style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                                    >
                                        <div className="mt-0.5 shrink-0 rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{hint.title}</p>
                                            <p className="mt-0.5 text-xs leading-5 text-zinc-400">{hint.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="ob-right flex items-center justify-center bg-white p-6 sm:p-10 lg:p-14">
                        <div className="w-full max-w-md">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5">
                                <House className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-800">Create your household</span>
                            </div>

                            <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                                What should we call it?
                            </h2>
                            <p className="mt-3 text-base leading-7 text-zinc-500">
                                This name appears on your dashboard and anchors everything you track. You can always rename it later.
                            </p>

                            <Form
                                {...store.form()}
                                disableWhileProcessing
                                className="mt-8 space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-semibold text-zinc-800">
                                                Household name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                autoFocus
                                                placeholder="e.g. The Adeyemi Family"
                                                className="h-12 rounded-xl border-zinc-200 text-base placeholder:text-zinc-400 focus-visible:ring-emerald-500"
                                            />
                                            {errors.name ? (
                                                <InputError message={errors.name} />
                                            ) : (
                                                <p className="text-xs text-zinc-400">
                                                    Something like "The Adeyemi Family" or "Our Lagos Home" works great.
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group h-12 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner />
                                                    Setting up...
                                                </>
                                            ) : (
                                                <>
                                                    Continue to Dashboard
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-center text-xs text-zinc-400">
                                            You can verify your email and invite family members after setup.
                                        </p>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
