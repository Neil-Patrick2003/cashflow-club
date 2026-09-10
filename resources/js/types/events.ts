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
