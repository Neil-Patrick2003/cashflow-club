import { router } from '@inertiajs/react';
import { formatPeso } from '@/lib/format';
import { index as payments } from '@/routes/payments';
import type {
    AccessMethod,
    Payment,
    PaymentFilters,
    PaymentMethod,
    PaymentStatus,
} from '@/types';

/* How the member got in, which is what decides whether there is anything to
   collect at all: a covered seat owes nothing, a paid one owes the price it
   was taken at, and a redeemed one was settled by the voucher. */
export const accessLabels: Record<AccessMethod, string> = {
    MEMBERSHIP: 'Membership',
    PAID: 'Paid',
    VOUCHER: 'Voucher',
};

/**
 * What one seat was taken on, as the door reads it. A covered seat says so;
 * anything paid for says what it cost, because the amount is the only part
 * the club still has to act on.
 */
export function accessSummary(seat: {
    access_method: AccessMethod;
    price_due: string;
}): string {
    return seat.access_method === 'PAID'
        ? formatPeso(seat.price_due)
        : accessLabels[seat.access_method];
}

/** How the club took the money, once it has. */
export const methodLabels: Record<PaymentMethod, string> = {
    CASH: 'Cash',
    BANK_TRANSFER: 'Bank transfer',
    GCASH: 'GCash',
};

/**
 * Where a seat's money stands. One covered by membership carries no payment,
 * and so never had anything outstanding: it reads settled like the rest.
 */
export function seatStanding(seat: {
    payment?: Payment | null;
}): PaymentStatus {
    return seat.payment?.status ?? 'PAID';
}

/** The order the page falls back to: what is still owed leads. */
export const defaultPaymentSort = '-owes_money';

/**
 * Narrow or reorder the payments table in place. Only the table and the
 * controls come back, so the rest of the page is left where the admin had it,
 * and the address bar carries the view so it can be shared or reloaded.
 */
export function visitPayments(
    filters: PaymentFilters,
    next: Partial<PaymentFilters>,
): void {
    const merged = { ...filters, ...next };

    router.get(
        payments.url({
            query: {
                filter: {
                    search: merged.search || undefined,
                    status: merged.status || undefined,
                },
                sort: merged.sort || undefined,
            },
        }),
        {},
        {
            only: ['seats', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        },
    );
}

/**
 * How one column is ordered now, and what clicking its header should ask for
 * next. A column nobody has clicked starts in whichever direction is worth
 * reading first: highest amount, or money still to come in.
 */
export function columnSort(
    filters: PaymentFilters,
    field: string,
    descendingFirst = false,
): { direction: 'ascending' | 'descending' | 'none'; next: string } {
    const current = filters.sort ?? defaultPaymentSort;

    if (current === field) {
        return { direction: 'ascending', next: `-${field}` };
    }

    if (current === `-${field}`) {
        return { direction: 'descending', next: field };
    }

    return {
        direction: 'none',
        next: descendingFirst ? `-${field}` : field,
    };
}
