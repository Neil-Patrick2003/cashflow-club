import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';

const navigation = [
    { label: 'Home', href: '#top' },
    { label: 'About', href: '#about' },
    { label: 'Membership', href: '#membership' },
    { label: 'Events', href: '#events' },
    { label: 'Resources', href: '#resources' },
    { label: 'Contact', href: '#contact' },
];

function ClubLogo({ markOnly = false }: { markOnly?: boolean }) {
    return (
        <span className="flex items-center gap-3">
            <img
                src="/cashflow-logo.png"
                alt="Philippine Cashflow Club"
                width={44}
                height={44}
                className={cn('shrink-0', markOnly ? 'size-10' : 'size-11')}
            />
            {!markOnly && (
                <span className="flex flex-col leading-none">
                    <span className="text-gold-400 text-[0.625rem] font-bold tracking-[0.22em] uppercase">
                        Philippine
                    </span>
                    <span className="font-display mt-1 text-xl leading-none font-extrabold tracking-wide text-white uppercase">
                        Cashflow Club
                    </span>
                </span>
            )}
        </span>
    );
}

/** Three bars that morph into an X as the drawer opens. */
function MenuIcon({ isOpen }: { isOpen: boolean }) {
    const bar =
        'absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none';

    return (
        <span className="relative block h-4 w-6">
            <span
                className={cn(
                    bar,
                    isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0',
                )}
            />
            <span
                className={cn(
                    bar,
                    'top-1/2 -translate-y-1/2',
                    isOpen && 'scale-x-0 opacity-0',
                )}
            />
            <span
                className={cn(
                    bar,
                    isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0',
                )}
            />
        </span>
    );
}

export default function SiteHeader() {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /** Lock background scrolling and close on Escape while the drawer is open. */
    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = overflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isMenuOpen]);

    return (
        <>
            <header className="border-royal-800/40 bg-ink-950/80 sticky top-0 z-50 border-b backdrop-blur-xl">
                {/* Three tracks on desktop so the links stay optically centred
                    in the header regardless of the logo or button widths. */}
                <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
                    <Link
                        href={home()}
                        aria-label="Philippine Cashflow Club home"
                        className="lg:justify-self-start"
                    >
                        <ClubLogo />
                    </Link>

                    <nav className="hidden items-center gap-7 lg:flex lg:justify-self-center">
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="hover:text-gold-400 text-sm font-medium text-white/70 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-5 lg:flex lg:justify-self-end">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="bg-gold text-royal-950 shadow-gold hover:shadow-gold-lg rounded-full px-6 py-2.5 text-sm font-bold transition-shadow"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="hover:text-gold-400 text-sm font-medium text-white/70 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-gold text-royal-950 shadow-gold hover:shadow-gold-lg rounded-full px-6 py-2.5 text-sm font-bold transition-shadow"
                                >
                                    Join the Club
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className="border-royal-800/60 text-gold-400 hover:border-gold-400/60 flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors lg:hidden"
                    >
                        <MenuIcon isOpen={isMenuOpen} />
                    </button>
                </div>
            </header>

            {/* Lives outside <header> on purpose: the header's backdrop-blur
                would otherwise become the containing block for these fixed
                children and trap them inside its 80px box. The viewport-sized
                wrapper clips the closed drawer, so parking it off-screen never
                widens the document. */}
            <div
                className={cn(
                    'fixed inset-0 z-60 overflow-hidden lg:hidden',
                    !isMenuOpen && 'pointer-events-none',
                )}
            >
                <div
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                    className={cn(
                        'bg-ink-950/70 absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none',
                        isMenuOpen ? 'opacity-100' : 'opacity-0',
                    )}
                />

                <div
                    id="mobile-navigation"
                    inert={!isMenuOpen}
                    className={cn(
                        'bg-ink-900 border-royal-800/50 absolute top-0 right-0 flex h-full w-80 max-w-[85vw] flex-col border-l shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none',
                        isMenuOpen ? 'translate-x-0' : 'translate-x-full',
                    )}
                >
                    <div className="border-royal-800/50 flex h-20 shrink-0 items-center justify-between border-b px-6">
                        <ClubLogo markOnly />
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                            className="border-royal-800/60 text-gold-400 flex size-10 items-center justify-center rounded-full border"
                        >
                            <MenuIcon isOpen />
                        </button>
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6">
                        {navigation.map((item, index) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    transitionDelay: isMenuOpen
                                        ? `${120 + index * 45}ms`
                                        : '0ms',
                                }}
                                className={cn(
                                    'font-display hover:text-gold-400 border-royal-800/40 border-b py-4 text-2xl font-extrabold tracking-wide text-white uppercase transition-all duration-300 ease-out motion-reduce:transition-none',
                                    isMenuOpen
                                        ? 'translate-x-0 opacity-100'
                                        : 'translate-x-6 opacity-0',
                                )}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="border-royal-800/50 flex shrink-0 flex-col gap-3 border-t px-6 py-6">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="bg-gold text-royal-950 rounded-full px-6 py-3.5 text-center text-sm font-bold"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="border-royal-800/60 rounded-full border px-6 py-3.5 text-center text-sm font-semibold text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-gold text-royal-950 shadow-gold rounded-full px-6 py-3.5 text-center text-sm font-bold"
                                >
                                    Join the Club
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
