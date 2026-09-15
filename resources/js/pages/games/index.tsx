import { Head, usePage } from '@inertiajs/react';
import ChapterFilter from '@/components/chapter-filter';
import GameScheduleSection from '@/components/game-schedule-section';
import PageHeader from '@/components/page-header';
import { scheduleTitle } from '@/lib/games';
import { index as games } from '@/routes/games';
import type { Auth, Chapter, ScheduledGame } from '@/types';

export default function Games({
    games: items,
    chapters,
    chapter,
    membershipLevel,
}: {
    games: ScheduledGame[];
    chapters: Chapter[];
    /** The chapter being read, or null across all of them. */
    chapter: number | null;
    membershipLevel: string | null;
}) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.is_admin ?? false;

    return (
        <>
            <Head title={scheduleTitle(isAdmin)} />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                {/* An admin is reading the club's schedule rather than shopping
                    for a seat, so the page says what it is instead of inviting
                    them in. */}
                <PageHeader
                    eyebrow="Club"
                    title={isAdmin ? 'Games' : 'Find a game'}
                    description={
                        isAdmin
                            ? 'Every game still to come, across every chapter. Open one to see who is turning up.'
                            : 'Browse every chapter. Your member price is applied automatically.'
                    }
                />

                <ChapterFilter chapters={chapters} selected={chapter} />

                <GameScheduleSection
                    games={items}
                    membershipLevel={membershipLevel}
                    isAdmin={isAdmin}
                />
            </div>
        </>
    );
}

Games.layout = ({ auth }: { auth: Auth }) => ({
    breadcrumbs: [
        {
            title: scheduleTitle(auth.user?.is_admin ?? false),
            href: games(),
        },
    ],
});
