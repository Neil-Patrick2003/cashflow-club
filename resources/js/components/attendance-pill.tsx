import { formatCheckInTime, hasArrived } from '@/lib/attendance';
import { cn } from '@/lib/utils';
import type { Attendance } from '@/types';

/**
 * Whether one seat's holder has come through the door. Someone who is in is
 * stated plainly, with the time they arrived; a seat still to arrive stays
 * quiet, because nothing has happened to it yet.
 */
export default function AttendancePill({
    seat,
}: {
    seat: { attendance?: Attendance | null };
}) {
    const attendance = hasArrived(seat) ? seat.attendance : null;

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-1.5 text-sm whitespace-nowrap',
                attendance ? 'font-medium text-white' : 'text-muted-foreground',
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    'size-1.5 shrink-0 rounded-full',
                    attendance ? 'bg-gold-400' : 'bg-white/25',
                )}
            />

            {attendance ? (
                <>
                    Attended
                    <span className="text-muted-foreground font-normal">
                        {formatCheckInTime(attendance.checked_in_at)}
                    </span>
                </>
            ) : (
                'Awaiting'
            )}
        </span>
    );
}
