import { Head } from '@inertiajs/react';
import MembershipLevelsSection from '@/components/membership-levels-section';
import { index as configuration } from '@/routes/configuration';
import { index as membershipLevels } from '@/routes/membership-levels';
import type { MembershipLevel } from '@/types';

export default function MembershipLevels({
    levels,
}: {
    levels: MembershipLevel[];
}) {
    return (
        <>
            <Head title="Membership levels" />

            <MembershipLevelsSection levels={levels} />
        </>
    );
}

MembershipLevels.layout = {
    breadcrumbs: [
        {
            title: 'Configuration',
            href: configuration(),
        },
        {
            title: 'Membership levels',
            href: membershipLevels(),
        },
    ],
};
