import {
    CalendarDays,
    Check,
    Clock3,
    Dices,
    MapPin,
    UserRound,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import GameRegisterDialog from '@/components/game-register-dialog';
import { Button } from '@/components/ui/button';
import { useToday } from '@/hooks/use-today';
import { type EventTiming, eventTiming } from '@/lib/events';
import { formatPeso, formatTime, toDateParts } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { GameType, ScheduledGame } from '@/types';

const typeLabels: Record<GameType, string> = {
    REGULAR: 'Regular game',
    SRT: 'SRT session',
};

/* The facilitated session is the premium one, so it is the one in gold; the
   standard session states its kind and stays out of the way. */
const typeStyles: Record<GameType, string> = {
    REGULAR: 'text-white/55',
    SRT: 'text-gold-400',
};

/** One line of the game's detail. */
function Fact({
    icon: Icon,
    children,
}: {
    icon: LucideIcon;
    children: string;
}) {
    return (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Icon
                aria-hidden="true"
                className="text-gold-400/70 size-3.5 shrink-0"
            />
            <span className="truncate">{children}</span>
        </div>
    );
}

/**
 * What this game costs this member, and why it costs that. A claimed seat
 * reports what it was taken at; how that seat stands is said on the button
 * rather than repeated here.
 */
function entryStanding(
    game: ScheduledGame,
    membershipLevel: string | null,
): { price: string; note: string } {
    const registration = game.registration;

    if (registration) {
        return {
            price: registration.price_due,
            note: registration.payment
                ? registration.payment.status === 'PENDING'
                    ? 'to settle with the club'
                    : 'paid'
                : 'included in your membership',
        };
    }

    if (game.entry.access_method === 'MEMBERSHIP') {
        return {
            price: game.entry.price_due,
            note: 'included in your membership',
        };
    }

    return {
        price: game.entry.price_due,
        note: membershipLevel ? `your ${membershipLevel} price` : 'guest price',
    };
}

/**
 * When the game runs, as `Sep 5 · 6:30 PM`. The day it falls on comes from its
 * event, so a game without one can still say what time it starts.
 */
function formatSchedule(game: ScheduledGame, timing: EventTiming): string {
    const time = formatTime(game.schedule_at);

    if (!game.event) {
        return time;
    }

    if (timing === 'today') {
        return `Today · ${time}`;
    }

    const { month, day } = toDateParts(game.event.date);

    return `${month} ${day} · ${time}`;
}

/** One game a member can turn up to. */
function GameCard({
    game,
    today,
    membershipLevel,
}: {
    game: ScheduledGame;
    today: string | null;
    membershipLevel: string | null;
}) {
    const event = game.event;
    const timing = event ? eventTiming(event, today) : 'upcoming';
    const { price, note } = entryStanding(game, membershipLevel);

    return (
        <li className="bg-ink-900/60 hover:bg-ink-800/50 flex flex-col rounded-xl p-4 transition-colors md:p-5">
            <div className="flex items-start justify-between gap-3">
                <p
                    className={cn(
                        'text-[0.625rem] font-bold tracking-[0.18em] uppercase',
                        typeStyles[game.type],
                    )}
                >
                    {typeLabels[game.type]}
                </p>

                {event?.chapter && (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-white/8 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-white/60 uppercase">
                        {event.chapter.name}
                    </span>
                )}
            </div>

            <h3 className="font-display mt-2 truncate text-xl leading-tight font-extrabold tracking-wide text-white uppercase">
                {game.code}
            </h3>

            <dl className="mt-4 flex flex-col gap-1.5">
                <Fact icon={CalendarDays}>{formatSchedule(game, timing)}</Fact>

                {event?.chapter && (
                    <Fact icon={MapPin}>{event.chapter.city}</Fact>
                )}

                {/* Only the facilitated type runs under someone. */}
                {game.type === 'SRT' && game.master_facilitator && (
                    <Fact icon={UserRound}>{game.master_facilitator.name}</Fact>
                )}

                <Fact icon={Users}>
                    {`${game.registrations_count}/${game.capacity} seats taken`}
                </Fact>
            </dl>

            {/* The price and the one thing a member can do about it close the
                card, side by side. */}
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                <div className="min-w-0">
                    <p className="text-gold-400 font-display text-2xl leading-none font-extrabold">
                        {formatPeso(price)}
                    </p>
                    <p className="text-muted-foreground mt-1.5 truncate text-xs">
                        {note}
                    </p>
                </div>

                <div className="shrink-0">
                    {/* A seat that still owes money says so, so a member
                        scanning the page can see what is outstanding. */}
                    {game.registration?.payment?.status === 'PENDING' ? (
                        <Button variant="outline" disabled>
                            <Clock3 />
                            Pending payment
                        </Button>
                    ) : game.registration ? (
                        <Button variant="outline" disabled>
                            <Check />
                            Registered
                        </Button>
                    ) : game.status === 'CANCELLED' ? (
                        <p className="text-muted-foreground text-sm font-semibold">
                            Cancelled
                        </p>
                    ) : game.registrations_count >= game.capacity ? (
                        <p className="text-muted-foreground text-sm font-semibold">
                            Fully booked
                        </p>
                    ) : (
                        <GameRegisterDialog game={game} />
                    )}
                </div>
            </div>
        </li>
    );
}

/** Every game still to come, soonest first. */
export default function GameScheduleSection({
    games,
    membershipLevel,
}: {
    games: ScheduledGame[];
    membershipLevel: string | null;
}) {
    const today = useToday();

    if (games.length === 0) {
        return (
            <div className="bg-ink-900/60 rounded-xl">
                <EmptyState
                    icon={Dices}
                    title="No games coming up"
                    description="Check back once the club puts the next session on the calendar."
                />
            </div>
        );
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
                <GameCard
                    key={game.id}
                    game={game}
                    today={today}
                    membershipLevel={membershipLevel}
                />
            ))}
        </ul>
    );
}
