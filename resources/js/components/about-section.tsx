import {
    ArrowRight,
    Handshake,
    HeartHandshake,
    Image as ImageIcon,
    UsersRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Value = {
    icon: typeof UsersRound;
    term: string;
    tagline: string;
    /** Set a path under /public to replace the empty state. */
    image: string | null;
    /** Fan placement on desktop; phones sit them flat and side by side. */
    position: string;
    width: string;
};

const values: Value[] = [
    {
        icon: UsersRound,
        term: 'Bayanihan',
        tagline: 'We help each other grow.',
        image: null,
        position: '-rotate-3 z-10',
        width: 'w-full sm:w-[36%] sm:-mr-[3%]',
    },
    {
        icon: HeartHandshake,
        term: 'Kapwa',
        tagline: 'We rise together.',
        image: null,
        position: 'translate-y-4 z-20 sm:translate-y-10',
        width: 'w-full sm:w-[38%]',
    },
    {
        icon: Handshake,
        term: 'Katiwala',
        tagline: 'We build with trust.',
        image: null,
        position: 'rotate-3 z-10 -translate-y-2 sm:-translate-y-4',
        width: 'w-full sm:w-[36%] sm:-ml-[3%]',
    },
];

export default function AboutSection() {
    return (
        /* One screen, matching the hero: the viewport less the sticky header,
           which is also what scroll-mt-20 offsets the anchor by. */
        <section
            id="about"
            className="bg-ink-950 relative flex min-h-[calc(100dvh-5rem)] scroll-mt-20 flex-col justify-center overflow-hidden"
        >
            <div className="glow-royal-soft absolute inset-0" />
            <div className="glow-gold absolute top-1/2 left-[38%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl" />

            {/* Wider than the usual container so the gallery can run large. */}
            <div className="relative mx-auto grid w-full max-w-[90rem] gap-[clamp(1rem,3vh,3.5rem)] px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:px-10 lg:py-8">
                <div>
                    <p className="eyebrow text-gold-400">Our journey</p>
                    <h2 className="heading-section mt-[clamp(0.75rem,1.6vh,1.25rem)] text-white">
                        Built on values.
                        <br />
                        <span className="text-gold-shine">
                            Driven by purpose.
                        </span>
                    </h2>
                    <p className="body-lead mt-[clamp(0.75rem,2vh,1.5rem)] max-w-md text-white/65">
                        Philippine Cashflow Club was founded in 2025 to help
                        ordinary Filipinos take control of their finances and
                        create multiple income streams through strategic
                        education and community support.
                    </p>

                    <a
                        href="#how-it-works"
                        className="border-gold-400/50 hover:border-gold-400 hover:bg-gold-400/10 text-gold-400 group mt-[clamp(1.25rem,3vh,2.5rem)] inline-flex items-center gap-3 rounded-xl border py-3 pr-3 pl-5 text-xs font-bold tracking-widest uppercase transition-colors sm:gap-4 sm:py-3.5 sm:pr-3.5 sm:pl-6 sm:text-sm"
                    >
                        Our story
                        <span className="border-gold-400/50 group-hover:bg-gold-400 group-hover:text-royal-950 flex size-8 items-center justify-center rounded-full border transition-colors sm:size-9">
                            <ArrowRight className="size-4" />
                        </span>
                    </a>
                </div>

                {/* Gallery: fanned on desktop, flat and side by side on phones. */}
                <div className="grid grid-cols-3 items-center gap-2 sm:flex sm:justify-center sm:gap-0">
                    {values.map((value) => (
                        <figure
                            key={value.term}
                            className={cn(
                                'border-royal-700/60 ring-gold-400/5 bg-royal-900 relative flex aspect-[4/5] items-end overflow-hidden rounded-xl border shadow-2xl ring-1 transition-transform duration-500 ease-out motion-reduce:transition-none sm:aspect-[3/4] sm:rounded-2xl lg:hover:-translate-y-2 lg:hover:rotate-0',
                                value.position,
                                value.width,
                            )}
                        >
                            {value.image ? (
                                <img
                                    src={value.image}
                                    alt=""
                                    className="absolute inset-0 size-full object-cover"
                                />
                            ) : (
                                /* Empty state — drop a path into `image` to replace it. */
                                <div className="bg-card absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/25">
                                    <ImageIcon className="size-6 sm:size-9" />
                                    <span className="hidden text-[0.625rem] font-bold tracking-[0.2em] uppercase sm:block">
                                        Add photo
                                    </span>
                                </div>
                            )}

                            {/* Scrim so the caption stays legible over any photo. */}
                            <div className="from-ink-950/95 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

                            <figcaption className="relative flex w-full flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-6">
                                <span className="bg-gold-400/15 text-gold-400 border-gold-400/40 flex size-8 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm sm:size-12">
                                    <value.icon className="size-4 sm:size-6" />
                                </span>
                                <span className="flex w-full min-w-0 flex-col sm:w-auto sm:flex-1">
                                    <span className="font-display text-sm leading-none font-extrabold tracking-wide text-white sm:text-2xl">
                                        {value.term}
                                    </span>
                                    <span className="mt-1 text-[0.625rem] leading-tight text-white/70 sm:mt-1.5 sm:text-sm">
                                        {value.tagline}
                                    </span>
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
