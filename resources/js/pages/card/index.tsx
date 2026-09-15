import { Head, usePage } from '@inertiajs/react';
import DigitalCard from '@/components/digital-card';
import MembershipHistory from '@/components/membership-history';
import PageHeader from '@/components/page-header';
import { show as card } from '@/routes/card';
import type { MembershipCard } from '@/types';

export default function Card({
    card: membershipCard,
    qr,
    membershipLevel,
    memberSince,
}: {
    card: MembershipCard;
    qr: string;
    membershipLevel: string | null;
    memberSince: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="My card" />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow="Membership"
                    title="Digital card"
                    description="Show this at any chapter to check in."
                />

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
                    <DigitalCard
                        card={membershipCard}
                        qr={qr}
                        name={auth.user.name}
                        level={membershipLevel}
                        memberSince={memberSince}
                    />

                    <div className="flex flex-col gap-6">
                        <section className="bg-ink-900/60 rounded-xl p-5">
                            <h2 className="text-lg font-bold text-white">
                                What this QR does
                            </h2>

                            <p className="text-muted-foreground mt-2 text-sm">
                                It carries a token, not your personal details.
                                Staff scan it at any chapter to identify you,
                                confirm your registration and record attendance.
                            </p>
                        </section>

                        <MembershipHistory
                            level={membershipLevel}
                            memberSince={memberSince}
                            chapter={membershipCard.chapter?.name ?? null}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

Card.layout = {
    breadcrumbs: [
        {
            title: 'My card',
            href: card(),
        },
    ],
};
