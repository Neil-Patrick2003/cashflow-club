import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { register } from '@/routes';

const proofPoints = [
    { value: '1,200+', label: 'Members', longLabel: 'Members nationwide' },
    { value: '12', label: 'Chapters', longLabel: 'Local chapters' },
    { value: '80+', label: 'Sessions', longLabel: 'Sessions played' },
];

/** Deterministic so server and client render identical markup. */
const particles = [
    { left: '8%', top: '22%', size: 3, delay: '0s' },
    { left: '18%', top: '68%', size: 2, delay: '1.4s' },
    { left: '31%', top: '38%', size: 4, delay: '3.1s' },
    { left: '44%', top: '80%', size: 2, delay: '2.2s' },
    { left: '57%', top: '18%', size: 3, delay: '4.6s' },
    { left: '66%', top: '58%', size: 2, delay: '0.7s' },
    { left: '74%', top: '30%', size: 4, delay: '5.3s' },
    { left: '83%', top: '72%', size: 2, delay: '2.9s' },
    { left: '91%', top: '44%', size: 3, delay: '1.9s' },
];

function HeroBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* Dark foundation → royal purple */}
            <div className="bg-night absolute inset-0" />

            {/* TODO: community photography layer goes here, under the scrim
                and above the gradient — e.g. a bg-cover div at ~15% opacity. */}

            {/* Radial purple lighting */}
            <div className="glow-royal motion-safe:animate-drift absolute inset-x-0 -top-1/4 h-[120%]" />
            <div className="glow-gold absolute top-1/3 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 blur-3xl" />

            {/* Particles */}
            {particles.map((particle) => (
                <span
                    key={`${particle.left}-${particle.top}`}
                    style={{
                        left: particle.left,
                        top: particle.top,
                        height: particle.size,
                        width: particle.size,
                        animationDelay: particle.delay,
                    }}
                    className="bg-gold-300/70 shadow-gold motion-safe:animate-float absolute rounded-full"
                />
            ))}

            {/* Vignette and base fade */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_35%,rgb(9_0_20/0.75)_100%)]" />
            <div className="from-ink-950 absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent" />
        </div>
    );
}

/** Vertical rhythm that shrinks with the viewport so the hero stays one screen. */
const blockGap = 'mt-[clamp(0.75rem,2vh,1.75rem)]';

export default function Hero() {
    return (
        /* Exactly one screen: the viewport less the sticky header. The floor
           keeps very short viewports scrolling rather than cramping. */
        <section className="relative isolate flex h-[calc(100dvh-5rem)] min-h-[34rem] flex-col">
            <HeroBackdrop />

            <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-6 text-center lg:px-10">
                {/* Purple glow behind the club seal */}
                <div className="relative">
                    <span
                        aria-hidden="true"
                        className="glow-gold absolute inset-0 -m-16 blur-2xl"
                    />
                    <img
                        src="/cashflow-logo.png"
                        alt="Philippine Cashflow Club"
                        width={140}
                        height={140}
                        className="relative size-[clamp(3.5rem,10vh,8rem)] drop-shadow-[0_18px_45px_rgba(109,32,184,0.75)]"
                    />
                </div>

                <p className={`eyebrow text-gold-400 ${blockGap}`}>
                    Learn. Earn. Empower.
                </p>

                <h1
                    className={`heading-hero-fit max-w-5xl text-white ${blockGap}`}
                >
                    Master your
                    <br />
                    <span className="text-gold-shine">Cashflow</span>
                    <br />
                    Future
                </h1>

                <p className={`body-lead max-w-xl text-white/70 ${blockGap}`}>
                    A Filipino community learning to build, grow, and keep
                    wealth — together. Real games, real numbers, real people.
                </p>

                <div
                    className={`flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4 ${blockGap}`}
                >
                    <Link
                        href={register()}
                        className="bg-gold text-royal-950 shadow-gold hover:shadow-gold-lg group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-shadow sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                    >
                        Join the movement
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a
                        href="#events"
                        className="border-gold-400/40 hover:border-gold-400 hover:bg-gold-400/10 text-gold-400 inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold transition-colors sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                    >
                        <CalendarDays className="size-5" />
                        See upcoming sessions
                    </a>
                </div>

                <dl
                    className={`border-royal-800/50 grid w-full max-w-2xl grid-cols-3 gap-4 border-t pt-[clamp(0.75rem,2vh,1.5rem)] ${blockGap}`}
                >
                    {proofPoints.map((point) => (
                        <div key={point.label}>
                            <dt className="sr-only">{point.longLabel}</dt>
                            <dd className="font-display text-gold-400 text-2xl leading-none font-black sm:text-3xl">
                                {point.value}
                            </dd>
                            <p className="mt-1.5 text-[0.6875rem] font-medium tracking-wide text-white/50 uppercase sm:text-xs">
                                <span className="sm:hidden">{point.label}</span>
                                <span className="hidden sm:inline">
                                    {point.longLabel}
                                </span>
                            </p>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
