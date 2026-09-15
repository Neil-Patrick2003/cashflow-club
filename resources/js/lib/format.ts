const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

/** `13:00:00` or `13:00` as the club reads it: `1:00 PM`. */
export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

/** An ISO date, or the date half of a timestamp, as `Sat, 12 Sep 2026`. */
export function formatDate(date: string): string {
    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
        'en-PH',
        {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        },
    );
}

/** A decimal string from the database as pesos, or `Free` when it is zero. */
export function formatPeso(amount: string | number): string {
    const value = Number(amount);

    return value === 0
        ? 'Free'
        : `₱${value.toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;
}

/** The `YYYY-MM-DD` a date input expects. */
export function toDateInputValue(date: string): string {
    return date.slice(0, 10);
}

/**
 * An ISO date split into the parts a date chip stacks: `{ month: 'Nov', day:
 * '7' }`. Read off the string rather than parsed as a `Date`, so the server
 * and the browser always agree on which day it is.
 */
export function toDateParts(date: string): { month: string; day: string } {
    const [, month, day] = date.slice(0, 10).split('-');

    return {
        month: MONTHS[Number(month) - 1] ?? '',
        day: String(Number(day)),
    };
}

/** The month an ISO date or timestamp falls in, as `Feb 2025`. */
export function formatMonthYear(date: string): string {
    const [year, month] = date.slice(0, 10).split('-');

    return `${MONTHS[Number(month) - 1] ?? ''} ${year}`;
}

/** The day an ISO date falls on, as `Saturday`. */
export function formatWeekday(date: string): string {
    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
        'en-PH',
        { weekday: 'long' },
    );
}
