import { Head } from '@inertiajs/react';
import PageHeader from '@/components/page-header';
import PaymentsSection from '@/components/payments-section';
import PaymentsToolbar from '@/components/payments-toolbar';
import { index as payments } from '@/routes/payments';
import type { PaymentFilters, SeatPayment } from '@/types';

export default function Payments({
    seats,
    filters,
}: {
    seats: SeatPayment[];
    filters: PaymentFilters;
}) {
    const isNarrowed = filters.search !== null || filters.status !== null;

    return (
        <>
            <Head title="Payments" />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow="Club"
                    title="Payments"
                    description="Every seat the club has taken and what it owes. Money still to come in leads the list; mark a seat paid once it is settled."
                />

                <PaymentsToolbar filters={filters} />

                <PaymentsSection
                    seats={seats}
                    filters={filters}
                    isNarrowed={isNarrowed}
                />
            </div>
        </>
    );
}

Payments.layout = {
    breadcrumbs: [
        {
            title: 'Payments',
            href: payments(),
        },
    ],
};
