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

/** How a person got their seat: covered, paid for, or redeemed. */
export type AccessMethod = 'MEMBERSHIP' | 'PAID' | 'VOUCHER';

/** Where the money has got to. A seat opens pending and stays there until in. */
export type PaymentStatus = 'PENDING' | 'PAID';

/** What one seat owes the club. */
export type Payment = {
    id: number;
    registration_id: number;
    amount: string;
    /** Recorded by hand in admin once the money is taken. */
    method: string | null;
    status: PaymentStatus;
    paid_at: string | null;
};

/** One person's seat at one game. A covered seat carries no payment. */
export type Registration = {
    id: number;
    user_id: number;
    game_id: number;
    access_method: AccessMethod;
    price_due: string;
    payment?: Payment | null;
};

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
    /** The event the game runs at, loaded for the member schedule. */
    event?: Event;
    registrations_count?: number;
};

/**
 * A game on the member schedule, carrying what it would cost this particular
 * member. The server decides both, so nobody registers at a price of their own
 * choosing.
 */
export type ScheduledGame = Game & {
    registrations_count: number;
    /** This member's own seat, or null if they have not claimed one. */
    registration: Registration | null;
    entry: {
        access_method: AccessMethod;
        price_due: string;
    };
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
