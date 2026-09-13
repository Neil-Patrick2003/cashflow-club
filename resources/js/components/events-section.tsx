import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, Image as ImageIcon, MapPin } from 'lucide-react';
import eventsData from '@/data/events.json';
import { toDateParts } from '@/lib/format';
import type { ClubEvent } from '@/types/events';
import { register } from '@/routes';

/** Falls back to the bundled sample data until a server prop is wired up. */
export default function EventsSection({
    events = eventsData as ClubEvent[],
}: {
    events?: ClubEvent[];
}) {
    return (
        <section
            id="events"
            className="bg-ink-950 relative scroll-mt-20 overflow-hidden px-5 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28"
        >
            {/* Soft light rather than a filled panel, so the section edges
                stay the same ink as its neighbours. */}
            <div className="glow-royal-soft absolute inset-0 opacity-60" />

            <div className="relative mx-auto w-full max-w-[90rem]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                    <div>
                        <p className="eyebrow text-gold-400">Upcoming events</p>
                        <h2 className="heading-section mt-3 text-white sm:mt-4">
                            Grow. Connect. Succeed.
                        </h2>
                    </div>

                    <a
                        href="#contact"
                        className="text-gold-400 hover:text-gold-300 group inline-flex shrink-0 items-center gap-2 text-[0.6875rem] font-bold tracking-widest uppercase transition-colors sm:text-xs"
                    >
                        View all events
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

                <ul className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
                    {events.map((event) => {
                        const { month, day } = toDateParts(event.date);

                        return (
                            <li key={event.id}>
                                <Link
                                    href={event.url ?? register()}
                                    className="border-royal-800/60 bg-royal-950/50 hover:border-gold-400/40 group flex h-full flex-col overflow-hidden rounded-2xl border transition-colors"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt=""
                                                className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                                            />
                                        ) : (
                                            /* Empty state — set `image` in events.json to replace it. */
                                            <div className="bg-card flex size-full flex-col items-center justify-center gap-2 text-white/25">
                                                <ImageIcon className="size-8" />
                                                <span className="text-[0.625rem] font-bold tracking-[0.2em] uppercase">
                                                    Add photo
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex flex-1 flex-col px-4 pb-5 sm:px-5 sm:pb-6">
                                        {/* Badge straddles the image edge, category sits below it. */}
                                        <div className="-mt-7 flex items-end gap-3 sm:-mt-8 sm:gap-4">
                                            <span className="bg-royal-700 border-royal-600/50 shadow-royal flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border sm:size-16">
                                                <span className="text-[0.625rem] font-bold tracking-widest text-white/70 uppercase">
                                                    {month}
                                                </span>
                                                <span className="font-display text-xl leading-none font-extrabold text-white sm:text-2xl">
                                                    {day}
                                                </span>
                                            </span>
                                            <span className="text-gold-400 pb-1 text-[0.625rem] font-bold tracking-widest uppercase sm:pb-1.5 sm:text-xs">
                                                {event.category}
                                            </span>
                                        </div>

                                        <h3 className="group-hover:text-gold-400 mt-3 text-base font-bold text-white transition-colors sm:mt-4 sm:text-lg">
                                            {event.title}
                                        </h3>

                                        <p className="mt-2.5 flex items-center gap-2 text-xs text-white/60 sm:mt-3 sm:text-sm">
                                            <MapPin className="text-gold-400/80 size-3.5 shrink-0 sm:size-4" />
                                            {event.location}
                                        </p>
                                        <p className="mt-1.5 flex items-center gap-2 text-xs text-white/60 sm:mt-2 sm:text-sm">
                                            <Clock className="text-gold-400/80 size-3.5 shrink-0 sm:size-4" />
                                            {event.time}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
