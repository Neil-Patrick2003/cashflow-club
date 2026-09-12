import { BookOpen, CalendarDays, Users } from 'lucide-react';
import SiteHeader from '@/components/site-header';
import type { AuthLayoutProps } from '@/types';

const proofPoints = [
    { icon: Users, value: '1,200+', label: 'Members nationwide' },
    { icon: BookOpen, value: '12', label: 'Local chapters' },
    { icon: CalendarDays, value: '80+', label: 'Sessions played' },
];

/** The club photography, dimmed and vignetted so form text stays readable. */
function AuthBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* Inline so the URL resolves against the document, not the Vite
                dev-server origin that serves the stylesheet. */}
            <div
                style={{ backgroundImage: "url('/login-background.png')" }}
                className="absolute inset-0 bg-cover bg-center"
            />
            {/* Just enough scrim to hold text contrast without losing the
                skyline and the club seal underneath it. */}
            <div className="bg-ink-950/25 absolute inset-0" />
            <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_25%,transparent_45%,rgb(9_0_20/0.6)_100%)]" />
        </div>
    );
}

/**
 * The pitch beside the form. Desktop only: on a phone the screen belongs to
 * the form, and the header already carries the club's identity.
 */
function BrandPanel() {
    return (
        <div className="hidden lg:block">
            <p className="eyebrow text-gold-400">
                Join the Philippine Cashflow Club
            </p>

            <h2 className="heading-section mt-4 text-white">
                Build your
                <br />
                <span className="text-gold-shine">Cashflow</span>
                <br />
                Future
            </h2>

            <p className="mt-5 text-lg font-bold text-white">
                Learn. Earn. Empower.
            </p>

            <p className="body-lead mt-2 max-w-md text-white/70">
                A Filipino community learning to build, grow, and keep wealth —
                together. Real games, real numbers, real people.
            </p>

            <dl className="mt-8 grid max-w-md grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
                {proofPoints.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="min-w-0 px-3 text-center">
                        <Icon
                            aria-hidden="true"
                            className="text-gold-400 mx-auto size-5"
                        />
                        <dt className="sr-only">{label}</dt>
                        <dd className="font-display text-gold-400 mt-2 text-2xl leading-none font-black">
                            {value}
                        </dd>
                        <p className="mt-1.5 text-[0.6875rem] font-medium tracking-wide text-white/55 uppercase">
                            {label}
                        </p>
                    </div>
                ))}
            </dl>

            <p className="font-script text-gold-400 mt-10 text-3xl leading-tight">
                More than a club.
                <br />
                It&apos;s a movement.
            </p>
            <svg
                viewBox="0 0 220 12"
                fill="none"
                aria-hidden="true"
                className="text-gold-400 mt-1 h-3 w-48"
            >
                <path
                    d="M2 9C42 2.5 128 1.5 218 4.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

export default function AuthBrandLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        /* `dark` scopes the shadcn palette to this surface: the auth pages are
           always the night theme, whatever the visitor's appearance setting. */
        <div className="dark bg-ink-950 h-svh overflow-hidden text-white">
            <SiteHeader />

            {/* Exactly one screen at every width: the viewport less the sticky
                header, so the document itself never scrolls. */}
            <main className="relative isolate h-[calc(100svh-5rem)]">
                <AuthBackdrop />

                {/* The scroll container is the inner track, not `main`, so the
                    backdrop stays pinned. `min-h-full` + `items-center` centres
                    the card while keeping its top reachable if a very short
                    screen ever does overflow. */}
                <div className="relative h-full overflow-y-auto">
                    <div className="mx-auto flex min-h-full w-full max-w-7xl items-center px-5 py-6 sm:px-6 lg:px-10">
                        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16">
                            <BrandPanel />

                            <section className="border-gold-400/25 bg-ink-950/55 shadow-royal mx-auto w-full max-w-md rounded-2xl border p-5 backdrop-blur-xl sm:p-7 lg:mx-0 lg:max-w-none lg:p-9">
                                {title ? (
                                    <h1 className="eyebrow text-gold-400">
                                        {title}
                                    </h1>
                                ) : null}
                                {description ? (
                                    <p className="mt-2 text-sm text-white/60">
                                        {description}
                                    </p>
                                ) : null}

                                <div className="mt-6">{children}</div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
