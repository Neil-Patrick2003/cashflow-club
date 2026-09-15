import { seatStanding } from '@/lib/payments';
import { cn } from '@/lib/utils';
import type { Payment, PaymentStatus } from '@/types';

const standingLabels: Record<PaymentStatus, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
};

/* Gold is the attention colour, so it marks the money still to come in; a seat
   with nothing outstanding sits back. */
const standingStyles: Record<PaymentStatus, string> = {
    PENDING: 'bg-gold-400/15 text-gold-400',
    PAID: 'bg-white/8 text-white/60',
};

/** Where one seat's money stands, as the club reads it at a glance. */
export default function SeatStandingPill({
    seat,
}: {
    seat: { payment?: Payment | null };
}) {
    const standing = seatStanding(seat);

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase',
                standingStyles[standing],
            )}
        >
            {standingLabels[standing]}
        </span>
    );
}
