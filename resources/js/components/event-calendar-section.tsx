import {
    CalendarDays,
    Dices,
    Presentation,
    UserRound,
    Users,
} from 'lucide-react';
import EmptyState from '@/components/empty-state';
import EventActionsMenu from '@/components/event-actions-menu';
import EventAddMenu from '@/components/event-add-menu';
import DateChip from '@/components/date-chip';
import GameDeleteDialog from '@/components/game-delete-dialog';
import GameFormDialog from '@/components/game-form-dialog';
import SeminarDeleteDialog from '@/components/seminar-delete-dialog';
import SeminarFormDialog from '@/components/seminar-form-dialog';
import { Badge } from '@/components/ui/badge';
import { useToday } from '@/hooks/use-today';
import {
    type EventTiming,
    eventCapacity,
    eventHoldings,
    eventTiming,
    formatHolding,
} from '@/lib/events';
import { formatPeso, formatTime, formatWeekday } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Chapter, Event, EventType, Facilitator } from '@/types';

/* Nothing on the calendar is drawn with a hairline: every surface is separated
   by its own fill, so gold marks the day the club is running, a past event
   sinks back towards the page, and everything else sits on plain ink. */
const cardStyles: Record<EventTiming, string> = {
    today: 'bg-gold-400/[0.07] hover:bg-gold-400/[0.1]',
    upcoming: 'bg-ink-900/60 hover:bg-ink-800/50',
    past: 'bg-ink-900/35 hover:bg-ink-900/60',
};

const typeStyles: Record<EventType, string> = {
    SPECIAL_EVENT: 'bg-gold-400/15 text-gold-400',
    ORIENTATION: 'bg-royal-800/70 text-white/85',
    GAME_DAY: 'bg-white/8 text-white/60',
};

const typeLabels: Record<EventType, string> = {
    SPECIAL_EVENT: 'Special event',
    ORIENTATION: 'Orientation',
    GAME_DAY: 'Game day',
};

/** What kind of occasion the event is. */
function EventTypePill({ type }: { type: EventType }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase',
                typeStyles[type],
            )}
        >
            {typeLabels[type]}
        </span>
    );
}

/**
 * What the event holds. An event can carry games, seminars, or both, so each
 * kind gets its own badge and an empty event says so.
 */
function EventHoldings({ event }: { event: Event }) {
    const { games, seminars } = eventHoldings(event);

    if (games === 0 && seminars === 0) {
        return <span className="text-sm text-white/40">Nothing scheduled</span>;
    }

    return (
        <>
            {games > 0 && (
                <Badge variant="secondary">
                    {formatHolding(games, 'game')}
                </Badge>
            )}

            {seminars > 0 && (
                <Badge
                    variant="secondary"
                    className="bg-gold-400/15 text-gold-400"
                >
                    {formatHolding(seminars, 'seminar')}
                </Badge>
            )}
        </>
    );
}

/**
 * Everything scheduled inside the event, games and seminars together in the
 * order the day runs them, each with the way to change it.
 */
function EventSchedule({
    event,
    facilitators,
}: {
    event: Event;
    facilitators: Facilitator[];
}) {
    const items = [
        ...(event.games ?? []).map((game) => ({
            id: `game-${game.id}`,
            at: game.schedule_at,
            icon: Dices,
            title: game.code,
            detail: `${formatTime(game.schedule_at)} · ${formatPeso(game.member_price)} members`,
            capacity: game.capacity,
            /* Only the facilitated type runs under someone. */
            facilitator:
                game.type === 'SRT'
                    ? (game.master_facilitator?.name ?? null)
                    : null,
            actions: (
                <>
                    <GameFormDialog
                        event={event}
                        facilitators={facilitators}
                        game={game}
                    />
                    <GameDeleteDialog game={game} />
                </>
            ),
        })),
        ...(event.seminars ?? []).map((seminar) => ({
            id: `seminar-${seminar.id}`,
            at: seminar.starts_at,
            icon: Presentation,
            title: seminar.title,
            detail: `${formatTime(seminar.starts_at)} · ${seminar.member_only ? 'Members only' : 'Open to all'}`,
            capacity: seminar.capacity,
            facilitator: null,
            actions: (
                <>
                    <SeminarFormDialog event={event} seminar={seminar} />
                    <SeminarDeleteDialog seminar={seminar} />
                </>
            ),
        })),
    ].sort((a, b) => a.at.localeCompare(b.at));

    if (items.length === 0) {
        return null;
    }

    /* One card each, flush with the event above them, so a long day reads as a
       stack of separate things rather than a block of rows. */
    return (
        <ul className="space-y-2">
            {items.map(
                ({
                    id,
                    icon: Icon,
                    title,
                    detail,
                    capacity,
                    facilitator,
                    actions,
                }) => (
                    <li
                        key={id}
                        className="bg-ink-950/40 hover:bg-ink-950/70 flex items-center gap-3 rounded-lg p-3 transition-colors"
                    >
                        <Icon
                            aria-hidden="true"
                            className="text-gold-400/70 size-4 shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                                {title}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                                {detail}
                            </p>

                            {facilitator && (
                                <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                                    <UserRound
                                        aria-hidden="true"
                                        className="text-gold-400/70 size-3 shrink-0"
                                    />
                                    <span className="truncate">
                                        {facilitator}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Its own column, so seats line up down the stack. */}
                        <span className="text-muted-foreground flex w-14 shrink-0 items-center justify-end gap-1.5 text-sm">
                            <Users
                                aria-hidden="true"
                                className="text-gold-400/70 size-3.5"
                            />
                            {capacity}
                            <span className="sr-only">seats</span>
                        </span>

                        <div className="flex shrink-0 items-center gap-1">
                            {actions}
                        </div>
                    </li>
                ),
            )}
        </ul>
    );
}

/** One event on the calendar: when it runs, what it holds, and what to do. */
function EventCard({
    event,
    chapters,
    facilitators,
    today,
}: {
    event: Event;
    chapters: Chapter[];
    facilitators: Facilitator[];
    today: string | null;
}) {
    const timing = eventTiming(event, today);

    const meta = [
        timing === 'today' ? 'Today' : formatWeekday(event.date),
        `${formatTime(event.start_time)}–${formatTime(event.end_time)}`,
        ...(event.chapter ? [event.chapter.name] : []),
    ];

    return (
        <li
            className={cn(
                'rounded-xl p-4 transition-colors md:px-5',
                cardStyles[timing],
            )}
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    <DateChip date={event.date} timing={timing} />

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-display truncate text-base leading-tight font-extrabold tracking-wide text-white uppercase">
                                {event.title}
                            </h3>

                            <EventTypePill type={event.type} />
                        </div>

                        <p
                            className={cn(
                                'mt-1 truncate text-sm',
                                timing === 'today'
                                    ? 'text-gold-400'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {meta.join(' · ')}
                        </p>
                    </div>
                </div>

                {/* What the event holds and the seats it puts on sale, then
                    the one way to change any of it. Registrations will sit
                    beside the seats. */}
                <div className="flex items-center gap-3 md:shrink-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <EventHoldings event={event} />
                    </div>

                    <span className="text-muted-foreground ml-auto flex shrink-0 items-center gap-1.5 text-sm whitespace-nowrap md:ml-0 md:w-24 md:justify-end">
                        <Users
                            aria-hidden="true"
                            className="text-gold-400/70 size-3.5"
                        />
                        {eventCapacity(event)} seats
                    </span>

                    <EventActionsMenu event={event} chapters={chapters} />
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <EventSchedule event={event} facilitators={facilitators} />

                <EventAddMenu event={event} facilitators={facilitators} />
            </div>
        </li>
    );
}

/** The club calendar: a card per event still to come, soonest first. */
export default function EventCalendarSection({
    events,
    chapters,
    facilitators,
}: {
    events: Event[];
    chapters: Chapter[];
    facilitators: Facilitator[];
}) {
    const today = useToday();

    if (events.length === 0) {
        return (
            <div className="bg-ink-900/60 rounded-xl">
                <EmptyState
                    icon={CalendarDays}
                    title="Nothing coming up"
                    description="Add the next game day or seminar to the calendar."
                />
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-3">
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    chapters={chapters}
                    facilitators={facilitators}
                    today={today}
                />
            ))}
        </ul>
    );
}
