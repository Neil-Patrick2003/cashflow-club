import { Head } from '@inertiajs/react';
import ChapterFilter from '@/components/chapter-filter';
import GameScheduleSection from '@/components/game-schedule-section';
import PageHeader from '@/components/page-header';
import { index as games } from '@/routes/games';
import type { Chapter, ScheduledGame } from '@/types';

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
    return (
        <>
            <Head title="Find games" />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow="Club"
                    title="Find a game"
                    description="Browse every chapter. Your member price is applied automatically."
                />

                <ChapterFilter chapters={chapters} selected={chapter} />

                <GameScheduleSection
                    games={items}
                    membershipLevel={membershipLevel}
                />
            </div>
        </>
    );
}

Games.layout = {
    breadcrumbs: [
        {
            title: 'Find games',
            href: games(),
        },
    ],
};
