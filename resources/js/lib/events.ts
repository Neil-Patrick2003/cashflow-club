import type { Event } from '@/types';

/**
 * How many games and seminars an event holds. Reads the `withCount` values the
 * calendar sends, and falls back to the relations the event page loads.
 */
export function eventHoldings(event: Event): {
    games: number;
    seminars: number;
} {
    return {
        games: event.games_count ?? event.games?.length ?? 0,
        seminars: event.seminars_count ?? event.seminars?.length ?? 0,
    };
}

/**
 * Every seat the event holds, across its games and its seminars. Reads the
 * `withSum` totals the calendar sends, and falls back to the relations the
 * event page loads.
 */
export function eventCapacity(event: Event): number {
    const games =
        event.games_sum_capacity ??
        event.games?.reduce((seats, game) => seats + game.capacity, 0) ??
        0;

    const seminars =
        event.seminars_sum_capacity ??
        event.seminars?.reduce(
            (seats, seminar) => seats + seminar.capacity,
            0,
        ) ??
        0;

    return Number(games) + Number(seminars);
}

/** `3 games`, `1 seminar` — the count with its noun pluralised. */
export function formatHolding(count: number, noun: string): string {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

/** Where an event sits against today. */
export type EventTiming = 'past' | 'today' | 'upcoming';

/**
 * Whether the event has been and gone, is running today, or is still ahead.
 * Pass today as `YYYY-MM-DD`; until the page knows it, everything reads as
 * upcoming so nothing is marked wrongly.
 */
export function eventTiming(event: Event, today: string | null): EventTiming {
    if (today === null) {
        return 'upcoming';
    }

    const date = event.date.slice(0, 10);

    if (date === today) {
        return 'today';
    }

    return date < today ? 'past' : 'upcoming';
}
