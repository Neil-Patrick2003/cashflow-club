import { ChevronDown, ChevronsUpDown, ChevronUp, Wallet } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import PaymentPaidDialog from '@/components/payment-paid-dialog';
import SeatStandingPill from '@/components/seat-standing-pill';
import SectionCard from '@/components/section-card';
import { formatDate, formatPeso, formatTime, toDateParts } from '@/lib/format';
import {
    accessLabels,
    columnSort,
    methodLabels,
    visitPayments,
} from '@/lib/payments';
import { cn } from '@/lib/utils';
import type { Game, PaymentFilters, SeatPayment } from '@/types';

/**
 * How the money came in, once it has. A seat with nothing to collect never
 * carries a method, and a pending one has not been recorded yet.
 */
function seatMethod(seat: SeatPayment): string {
    return seat.payment?.method ? methodLabels[seat.payment.method] : '—';
}

/** The phone card's one-line summary: how they got in, and how they paid. */
function seatDetail(seat: SeatPayment): string {
    const access = accessLabels[seat.access_method];
    const method = seat.payment?.method;

    return method ? `${access} · ${methodLabels[method]}` : access;
}

/** When and where the seat's game runs, as `Sep 5 · Makati Chapter`. */
function gameDetail(game: Game): string {
    if (!game.event) {
        return formatTime(game.schedule_at);
    }

    const { month, day } = toDateParts(game.event.date);
    const chapter = game.event.chapter;

    return chapter ? `${month} ${day} · ${chapter.name}` : `${month} ${day}`;
}

/**
 * What the admin can do about one seat: collect what it owes, or, once it is
 * settled, see the day the money came in.
 */
function SeatAction({
    seat,
    showLabel = false,
}: {
    seat: SeatPayment;
    showLabel?: boolean;
}) {
    const payment = seat.payment;

    if (payment?.status === 'PENDING') {
        return (
            <PaymentPaidDialog
                seat={seat}
                payment={payment}
                showLabel={showLabel}
            />
        );
    }

    if (payment?.paid_at) {
        return (
            <span className="text-muted-foreground text-sm whitespace-nowrap">
                {formatDate(payment.paid_at)}
            </span>
        );
    }

    return <span className="text-muted-foreground text-sm">—</span>;
}

const directionIcons = {
    ascending: ChevronUp,
    descending: ChevronDown,
    none: ChevronsUpDown,
};

/**
 * A column the table can be ordered by. The one in force is gold and says
 * which way it runs; the rest sit back until they are asked for.
 */
function SortableHeader({
    filters,
    field,
    label,
    descendingFirst = false,
}: {
    filters: PaymentFilters;
    field: string;
    label: string;
    descendingFirst?: boolean;
}) {
    const { direction, next } = columnSort(filters, field, descendingFirst);
    const Icon = directionIcons[direction];

    return (
        <th scope="col" aria-sort={direction} className="px-5 py-3">
            <button
                type="button"
                onClick={() => visitPayments(filters, { sort: next })}
                className={cn(
                    'inline-flex items-center gap-1.5 tracking-[0.22em] uppercase transition-colors',
                    direction === 'none'
                        ? 'hover:text-white/60'
                        : 'text-gold-400',
                )}
            >
                {label}
                <Icon aria-hidden="true" className="size-3" />
            </button>
        </th>
    );
}

/** The phone layout: one card per seat, no sideways scrolling. */
function SeatCards({ seats }: { seats: SeatPayment[] }) {
    return (
        <ul className="divide-gold-400/10 divide-y md:hidden">
            {seats.map((seat) => (
                <li
                    key={seat.id}
                    className="flex items-start justify-between gap-3 px-4 py-4"
                >
                    <div className="min-w-0">
                        <p className="font-display truncate text-base leading-tight font-extrabold tracking-wide text-white uppercase">
                            {seat.user.name}
                        </p>

                        <p className="text-muted-foreground mt-1.5 truncate text-sm">
                            {seat.game.code} · {gameDetail(seat.game)}
                        </p>

                        <p className="mt-1.5 text-sm">
                            <span className="text-gold-400 font-bold">
                                {formatPeso(seat.price_due)}
                            </span>
                            <span className="text-muted-foreground">
                                {' '}
                                · {seatDetail(seat)}
                            </span>
                        </p>

                        <SeatStandingPill seat={seat} />
                    </div>

                    <div className="flex shrink-0 items-center">
                        <SeatAction seat={seat} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

/** The layout from `md` up, once there is room for every column. */
function SeatTable({
    seats,
    filters,
}: {
    seats: SeatPayment[];
    filters: PaymentFilters;
}) {
    return (
        <table className="hidden w-full text-left text-sm md:table">
            <thead>
                <tr className="text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                    <SortableHeader
                        filters={filters}
                        field="member"
                        label="Member"
                    />
                    <th scope="col" className="px-5 py-3">
                        Game
                    </th>
                    <SortableHeader
                        filters={filters}
                        field="amount"
                        label="Amount"
                        descendingFirst
                    />
                    <th scope="col" className="px-5 py-3">
                        Access
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Method
                    </th>
                    <SortableHeader
                        filters={filters}
                        field="owes_money"
                        label="Status"
                        descendingFirst
                    />
                    <th scope="col" className="px-5 py-3 text-right">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>

            <tbody>
                {seats.map((seat) => (
                    <tr
                        key={seat.id}
                        className="border-gold-400/10 border-t transition-colors hover:bg-white/[0.03]"
                    >
                        <th scope="row" className="px-5 py-4">
                            <span className="font-display block text-base font-extrabold tracking-wide text-white uppercase">
                                {seat.user.name}
                            </span>
                            <span className="text-muted-foreground block font-normal">
                                {seat.user.email}
                            </span>
                        </th>
                        <td className="px-5 py-4">
                            <span className="block text-white">
                                {seat.game.code}
                            </span>
                            <span className="text-muted-foreground block">
                                {gameDetail(seat.game)}
                            </span>
                        </td>
                        <td className="text-gold-400 px-5 py-4 font-bold whitespace-nowrap">
                            {formatPeso(seat.price_due)}
                        </td>
                        <td className="text-muted-foreground px-5 py-4 whitespace-nowrap">
                            {accessLabels[seat.access_method]}
                        </td>
                        <td className="text-muted-foreground px-5 py-4 whitespace-nowrap">
                            {seatMethod(seat)}
                        </td>
                        <td className="px-5 py-4">
                            <SeatStandingPill seat={seat} />
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex justify-end">
                                <SeatAction seat={seat} showLabel />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function PaymentsSection({
    seats,
    filters,
    isNarrowed = false,
}: {
    seats: SeatPayment[];
    filters: PaymentFilters;
    /** Whether a search or a standing is hiding seats that exist. */
    isNarrowed?: boolean;
}) {
    const pending = seats.filter((seat) => seat.payment?.status === 'PENDING');
    const outstanding = pending.reduce(
        (total, seat) => total + Number(seat.payment?.amount ?? 0),
        0,
    );

    return (
        <SectionCard
            title="Payments"
            description={
                pending.length === 0
                    ? 'Every seat taken is settled'
                    : `${pending.length} seat${pending.length === 1 ? '' : 's'} awaiting payment · ₱${outstanding.toLocaleString('en-PH')} outstanding`
            }
        >
            {seats.length === 0 ? (
                <EmptyState
                    icon={Wallet}
                    title={isNarrowed ? 'No seats match' : 'No seats yet'}
                    description={
                        isNarrowed
                            ? 'Try a different search, or show every standing.'
                            : 'Money to collect shows up here once members start claiming seats.'
                    }
                />
            ) : (
                <>
                    <SeatCards seats={seats} />
                    <SeatTable seats={seats} filters={filters} />
                </>
            )}
        </SectionCard>
    );
}
