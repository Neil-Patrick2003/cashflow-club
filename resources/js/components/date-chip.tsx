import type { EventTiming } from '@/lib/events';
import { toDateParts } from '@/lib/format';
import { cn } from '@/lib/utils';

/* Gold marks the day the club is running, royal marks what is still ahead,
   and a past date recedes to grey rather than competing with either. */
const chipStyles: Record<EventTiming, string> = {
    today: 'bg-gold-400/20 text-gold-300',
    upcoming: 'bg-royal-800/70 text-white',
    past: 'bg-white/5 text-white/45',
};

/** The date as a stacked chip, so a list of them is scannable by day. */
export default function DateChip({
    date,
    timing,
}: {
    date: string;
    timing: EventTiming;
}) {
    const { month, day } = toDateParts(date);

    return (
        <div
            className={cn(
                'flex size-12 shrink-0 flex-col items-center justify-center rounded-lg',
                chipStyles[timing],
            )}
        >
            <span className="text-[0.625rem] font-bold tracking-[0.18em] uppercase opacity-70">
                {month}
            </span>
            <span className="font-display text-lg leading-none font-extrabold">
                {day}
            </span>
        </div>
    );
}
