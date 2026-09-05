import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import PhilippineMap from '@/components/philippine-map';
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

const trails = [
    { top: '26%', width: '34%', delay: '0s', tint: 'via-gold-400/70' },
    { top: '52%', width: '22%', delay: '3.5s', tint: 'via-ph-blue/50' },
    { top: '78%', width: '28%', delay: '6s', tint: 'via-gold-300/60' },
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

            {/* Philippine archipelago silhouette */}
            <PhilippineMap className="absolute -right-16 bottom-0 h-[125%] w-auto text-white/[0.07] sm:right-0 lg:right-[6%]" />

            {/* Blue and red ribbons — cultural accents, matching the logo */}
            <svg
                className="absolute inset-0 h-full w-full opacity-70"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient
                        id="ribbon-blue"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#1455D9" stopOpacity="0" />
                        <stop
                            offset="45%"
                            stopColor="#1455D9"
                            stopOpacity="0.85"
                        />
                        <stop
                            offset="100%"
                            stopColor="#1455D9"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient id="ribbon-red" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E52535" stopOpacity="0" />
                        <stop
                            offset="50%"
                            stopColor="#E52535"
                            stopOpacity="0.75"
                        />
                        <stop
                            offset="100%"
                            stopColor="#E52535"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="ribbon-gold"
                        x1="0"
                        y1="1"
                        x2="1"
                        y2="0"
                    >
                        <stop offset="0%" stopColor="#FFC400" stopOpacity="0" />
                        <stop
                            offset="50%"
                            stopColor="#FFD84A"
                            stopOpacity="0.9"
                        />
                        <stop
                            offset="100%"
                            stopColor="#FFC400"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>
                <g className="blur-[2px]">
                    <path
                        d="M-120 620 C 240 470, 420 760, 760 560 S 1240 300, 1580 420"
                        stroke="url(#ribbon-blue)"
                        strokeWidth="2.5"
                    />
                    <path
                        d="M-120 700 C 260 560, 460 830, 800 640 S 1260 380, 1580 500"
                        stroke="url(#ribbon-red)"
                        strokeWidth="2"
                    />
                    <path
                        d="M-120 540 C 280 400, 400 690, 780 470 S 1220 210, 1580 330"
                        stroke="url(#ribbon-gold)"
                        strokeWidth="1.5"
                    />
                </g>
            </svg>

            {/* Gold light trails */}
            {trails.map((trail) => (
                <span
                    key={trail.top}
                    style={{
                        top: trail.top,
                        width: trail.width,
                        animationDelay: trail.delay,
                    }}
                    className={`motion-safe:animate-trail absolute left-0 h-px bg-gradient-to-r from-transparent to-transparent ${trail.tint}`}
                />
            ))}

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
                        className="bg-gold text-royal-950 shadow-gold hover:shadow-gold-lg group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-shadow sm:w-auto"
                    >
                        Join the movement
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a
                        href="#events"
                        className="border-gold-400/40 hover:border-gold-400 hover:bg-gold-400/10 text-gold-400 inline-flex w-full items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-base font-semibold transition-colors sm:w-auto"
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
