import { Head } from '@inertiajs/react';
import GameCheckInScanner from '@/components/game-check-in-scanner';
import GameRosterSection from '@/components/game-roster-section';
import PageHeader from '@/components/page-header';
import { formatDate, formatTime } from '@/lib/format';
import { gameTypeLabels, scheduleTitle } from '@/lib/games';
import { index as games, roster } from '@/routes/games';
import type { Game, RosterSeat } from '@/types';

/**
 * When and where the game runs, as one line under its code. The day comes from
 * its event, so a game without one can still say what time it starts.
 */
function gameSummary(game: Game): string {
    const parts = [
        game.event
            ? `${formatDate(game.event.date)} · ${formatTime(game.schedule_at)}`
            : formatTime(game.schedule_at),
    ];

    if (game.event?.chapter) {
        parts.push(game.event.chapter.name);
    }

    /* Only the facilitated type runs under someone. */
    if (game.type === 'SRT' && game.master_facilitator) {
        parts.push(game.master_facilitator.name);
    }

    return parts.join(' · ');
}

export default function Roster({
    game,
    seats,
}: {
    game: Game;
    seats: RosterSeat[];
}) {
    return (
        <>
            <Head title={`${game.code} roster`} />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow={gameTypeLabels[game.type]}
                    title={game.code}
                    description={gameSummary(game)}
                />

                {/* The scanner is the door's tool and the roster is what it
                    writes to, so they sit side by side once there is room and
                    stack scanner-first on a phone at the desk. */}
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(18rem,22rem)_1fr] lg:gap-8">
                    <GameCheckInScanner game={game} />

                    {/* A grid column sizes itself to its content unless it is
                        told it may shrink, so the roster gets that here rather
                        than pushing its table out over the page. */}
                    <div className="min-w-0">
                        <GameRosterSection game={game} seats={seats} />
                    </div>
                </div>
            </div>
        </>
    );
}

Roster.layout = ({ game }: { game: Game }) => ({
    breadcrumbs: [
        {
            /* Only an admin can reach the roster, so the trail leads back the
               way they read the schedule. */
            title: scheduleTitle(true),
            href: games(),
        },
        {
            title: game.code,
            href: roster(game.id),
        },
    ],
});
