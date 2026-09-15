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

/** How the club took the money, recorded by hand in admin once it is in. */
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'GCASH';

/** How the door knew someone had arrived: it read their card, or the club did. */
export type CheckInMethod = 'QR' | 'MANUAL';

/**
 * Proof that the holder of one seat turned up. Absent until they do, so a
 * no-show is simply a seat with none, still registered and still paid.
 */
export type Attendance = {
    id: number;
    registration_id: number;
    checked_in_at: string;
    method: CheckInMethod;
    recorded_by: number | null;
};

/** What one seat owes the club. */
export type Payment = {
    id: number;
    registration_id: number;
    amount: string;
    /** Recorded by hand in admin once the money is taken. */
    method: PaymentMethod | null;
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

/**
 * One person on a roster: who they are and what the club counts them as. A
 * guest holds no level, which is what makes them a guest.
 */
export type Participant = {
    id: number;
    name: string;
    email: string;
    membership_level?: { id: number; name: string } | null;
};

/** What the payments page is currently narrowed and ordered by. */
export type PaymentFilters = {
    search: string | null;
    status: PaymentStatus | null;
    sort: string | null;
};

/**
 * One seat on the admin payments page: who holds it, what it is for, and what
 * it owes. A seat covered by membership carries no payment at all.
 */
export type SeatPayment = Registration & {
    user: { id: number; name: string; email: string };
    game: Game;
};

/**
 * One seat on a game's roster: who is turning up, what they owe, and whether
 * they have arrived. The game is the page itself, so a seat never repeats it.
 */
export type RosterSeat = Registration & {
    user: Participant;
    /** Null until the door records them in. */
    attendance?: Attendance | null;
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
