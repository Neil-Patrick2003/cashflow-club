import { router } from '@inertiajs/react';
import { index as payments } from '@/routes/payments';
import type { PaymentFilters } from '@/types';

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
