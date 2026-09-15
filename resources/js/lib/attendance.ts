import type { Attendance, RosterSeat } from '@/types';

/** Whether the door has recorded this seat's holder as having arrived. */
export function hasArrived(seat: { attendance?: Attendance | null }): boolean {
    return Boolean(seat.attendance);
}

/** How many of the roster's seats have been taken up so far. */
export function arrivedCount(seats: RosterSeat[]): number {
    return seats.filter(hasArrived).length;
}

/** What the club calls this person: the level they hold, or a guest. */
export function membershipLabel(participant: {
    membership_level?: { name: string } | null;
}): string {
    return participant.membership_level?.name ?? 'Non-member';
}

/** The time of day a check-in was recorded, as `1:05 PM`. */
export function formatCheckInTime(checkedInAt: string): string {
    return new Date(checkedInAt).toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
    });
}
