import type { Chapter } from './chapters';

/** Shape of one event. Mirrors what a server-side `events` prop should send. */
export type ClubEvent = {
    id: number;
    title: string;
    category: string;
    /** ISO date, `YYYY-MM-DD`. */
    date: string;
    time: string;
    location: string;
    /** Path under /public, or null to show the empty state. */
    image: string | null;
    /** Destination for the card, or null to fall back to registration. */
    url: string | null;
};

/** What kind of occasion an event is, independent of what it holds. */
export type EventType = 'GAME_DAY' | 'SPECIAL_EVENT' | 'ORIENTATION';

export type GameType = 'REGULAR' | 'SRT';

export type GameStatus = 'SCHEDULED' | 'OPEN' | 'COMPLETED' | 'CANCELLED';

/** A user who can run an SRT session. */
export type Facilitator = {
    id: number;
    name: string;
};

/**
 * One game session inside an event. REGULAR is the standard session: free for
 * members, paid by non-members, larger capacity, no master facilitator. SRT is
 * the premium facilitated one: everyone pays, capacity seats tables of four,
 * and a master facilitator runs it.
 */
export type Game = {
    id: number;
    code: string;
    event_id: number;
    chapter_id: number;
    type: GameType;
    schedule_at: string;
    member_price: string;
    non_member_price: string;
    capacity: number;
    master_facilitator_id: number | null;
    master_facilitator?: Facilitator | null;
    status: GameStatus;
};

/** One seminar inside an event. */
export type Seminar = {
    id: number;
    event_id: number;
    title: string;
    starts_at: string;
    capacity: number;
    member_only: boolean;
};

/**
 * A chapter's calendar entry. It holds any number of games, any number of
 * seminars, or both on the same day; what it holds follows from those, so the
 * event itself never declares a type.
 */
export type Event = {
    id: number;
    chapter_id: number;
    chapter?: Chapter;
    title: string;
    type: EventType;
    date: string;
    start_time: string;
    end_time: string;
    games?: Game[];
    seminars?: Seminar[];
    games_count?: number;
    seminars_count?: number;
    /** Seats across the event's games, from `withSum`; null when it holds none. */
    games_sum_capacity?: number | null;
    /** Seats across the event's seminars, from `withSum`; null when it holds none. */
    seminars_sum_capacity?: number | null;
};
