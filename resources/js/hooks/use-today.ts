import { useSyncExternalStore } from 'react';

/** A `Date` as the `YYYY-MM-DD` the club's dates are stored in. */
function toLocalDateString(date: Date): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

/* The date cannot change under a page view, so there is nothing to subscribe
   to and no teardown to do. */
function subscribe(): () => void {
    return () => {};
}

function getSnapshot(): string {
    return toLocalDateString(new Date());
}

function getServerSnapshot(): null {
    return null;
}

/**
 * Today in the reader's own timezone, as `YYYY-MM-DD`, or null until the page
 * has hydrated. The server renders in its own timezone, so anything keyed off
 * today stays neutral for the first paint rather than hydrating to a different
 * answer.
 */
export function useToday(): string | null {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
