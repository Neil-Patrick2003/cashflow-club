import { CircleCheck, CircleX, Dices } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import { toDateParts } from '@/lib/format';
import type { Game, GameType } from '@/types';

/** A game the member has played, and whether it counted toward the level. */
export type PlayedGame = Game & { counts: boolean };

const typeLabels: Record<GameType, string> = {
    REGULAR: 'Regular',
    SRT: 'SRT',
};

/** The day the game ran, as `Aug 22`. */
function playedOn(game: PlayedGame): string {
    if (!game.event) {
        return '—';
    }

    const { month, day } = toDateParts(game.event.date);

    return `${month} ${day}`;
}

/** Whether this one counted. A game the club called off counts for nobody. */
function CountsMark({ counts }: { counts: boolean }) {
    return counts ? (
        <>
            <CircleCheck
                aria-hidden="true"
                className="text-gold-400 size-4 shrink-0"
            />
            <span className="sr-only">Counts</span>
        </>
    ) : (
        <>
            <CircleX
                aria-hidden="true"
                className="size-4 shrink-0 text-white/25"
            />
            <span className="sr-only">Cancelled, does not count</span>
        </>
    );
}

/** The phone layout: one row per game, no sideways scrolling. */
function GameCards({ games }: { games: PlayedGame[] }) {
    return (
        <ul className="divide-gold-400/10 divide-y md:hidden">
            {games.map((game) => (
                <li
                    key={game.id}
                    className="flex items-center justify-between gap-3 px-4 py-3.5"
                >
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                            {game.code}
                        </p>
                        <p className="text-muted-foreground mt-0.5 truncate text-sm">
                            {game.event?.chapter?.name} · {playedOn(game)} ·{' '}
                            {typeLabels[game.type]}
                        </p>
                    </div>

                    <CountsMark counts={game.counts} />
                </li>
            ))}
        </ul>
    );
}

/** The layout from `md` up, once there is room for every column. */
function GameTable({ games }: { games: PlayedGame[] }) {
    return (
        <table className="hidden w-full text-left text-sm md:table">
            <thead>
                <tr className="text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                    <th scope="col" className="px-5 py-3">
                        Game
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Chapter
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Date
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Type
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Counts
                    </th>
                </tr>
            </thead>

            <tbody>
                {games.map((game) => (
                    <tr
                        key={game.id}
                        className="border-gold-400/10 border-t transition-colors hover:bg-white/[0.03]"
                    >
                        <th
                            scope="row"
                            className="px-5 py-3.5 font-semibold text-white"
                        >
                            {game.code}
                        </th>
                        <td className="text-muted-foreground px-5 py-3.5">
                            {game.event?.chapter?.name ?? '—'}
                        </td>
                        <td className="text-muted-foreground px-5 py-3.5 whitespace-nowrap">
                            {playedOn(game)}
                        </td>
                        <td className="text-muted-foreground px-5 py-3.5">
                            {typeLabels[game.type]}
                        </td>
                        <td className="px-5 py-3.5">
                            <CountsMark counts={game.counts} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/** Every game the member has played, and which of them counted. */
export default function EligibleGamesTable({
    games,
    levelName,
}: {
    games: PlayedGame[];
    levelName: string;
}) {
    return (
        <section className="bg-ink-900/60 overflow-hidden rounded-xl">
            <header className="px-4 py-4 md:px-5">
                <h2 className="text-lg font-bold text-white">
                    Eligible games toward {levelName}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Regular and SRT games count. Games played at any chapter
                    count the same.
                </p>
            </header>

            {games.length === 0 ? (
                <EmptyState
                    icon={Dices}
                    title="No games played yet"
                    description="Claim a seat at the next session; it counts here once the day has passed."
                />
            ) : (
                <>
                    <GameCards games={games} />
                    <GameTable games={games} />
                </>
            )}
        </section>
    );
}
