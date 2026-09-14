import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { defaultPaymentSort, visitPayments } from '@/lib/payments';
import type { PaymentFilters, PaymentStatus } from '@/types';

/* Radix needs a value for every item, so the unfiltered choice carries one of
   its own rather than an empty string. */
const allStandings = 'ALL';

const standingOptions: {
    value: PaymentStatus | typeof allStandings;
    label: string;
}[] = [
    { value: allStandings, label: 'All seats' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
];

/* The table sorts from its own headers, which a phone never sees, so the
   orders it offers are kept within reach here instead. */
const sortOptions: { value: string; label: string }[] = [
    { value: defaultPaymentSort, label: 'Outstanding first' },
    { value: '-claimed', label: 'Newest first' },
    { value: 'claimed', label: 'Oldest first' },
    { value: '-amount', label: 'Amount, high to low' },
    { value: 'amount', label: 'Amount, low to high' },
    { value: 'member', label: 'Member, A to Z' },
];

/** Narrows the payments table by member, game, or where its money stands. */
export default function PaymentsToolbar({
    filters,
}: {
    filters: PaymentFilters;
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    /* Typing settles before it is sent. Once the answer lands the box and the
       page agree again, so this does nothing until the next keystroke. */
    useEffect(() => {
        if (search === (filters.search ?? '')) {
            return;
        }

        const timeout = setTimeout(
            () => visitPayments(filters, { search: search || null }),
            300,
        );

        return () => clearTimeout(timeout);
    }, [search, filters]);

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:max-w-sm md:flex-1">
                <Search
                    aria-hidden="true"
                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35"
                />

                <Input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search member or game"
                    aria-label="Search payments"
                    className="h-11 pl-9 md:h-10"
                />
            </div>

            <Select
                value={filters.status ?? allStandings}
                onValueChange={(status) =>
                    visitPayments(filters, {
                        status:
                            status === allStandings
                                ? null
                                : (status as PaymentStatus),
                    })
                }
            >
                <SelectTrigger
                    aria-label="Filter by status"
                    className="h-11 w-full md:ml-auto md:h-10 md:w-44"
                >
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {standingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.sort ?? defaultPaymentSort}
                onValueChange={(sort) => visitPayments(filters, { sort })}
            >
                <SelectTrigger
                    aria-label="Sort payments"
                    className="h-11 w-full md:hidden"
                >
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
