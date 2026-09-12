import { Trophy } from 'lucide-react';
import EmptyState from '@/components/empty-state';
import LevelDeleteDialog from '@/components/level-delete-dialog';
import LevelFormDialog from '@/components/level-form-dialog';
import RequirementList from '@/components/requirement-list';
import SectionCard from '@/components/section-card';
import type { MembershipLevel } from '@/types';

function LevelActions({
    level,
    showLabels = false,
}: {
    level: MembershipLevel;
    showLabels?: boolean;
}) {
    return (
        <div className="flex shrink-0 items-center gap-1">
            <LevelFormDialog level={level} showLabel={showLabels} />
            <LevelDeleteDialog level={level} showLabel={showLabels} />
        </div>
    );
}

function RankBadge({ rankOrder }: { rankOrder: number }) {
    return (
        <span className="border-gold-400/25 text-gold-400 font-display flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold">
            {rankOrder}
        </span>
    );
}

/** The phone layout: one card per level, requirements wrapping underneath. */
function LevelCards({ levels }: { levels: MembershipLevel[] }) {
    return (
        <ul className="divide-gold-400/10 divide-y md:hidden">
            {levels.map((level) => (
                <li key={level.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <RankBadge rankOrder={level.rank_order} />

                            <p className="font-display truncate text-base leading-tight font-extrabold tracking-wide text-white uppercase">
                                {level.name}
                            </p>
                        </div>

                        <LevelActions level={level} />
                    </div>

                    <div className="mt-3">
                        <RequirementList level={level} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

/** The layout from `md` up, with requirements in their own column. */
function LevelTable({ levels }: { levels: MembershipLevel[] }) {
    return (
        <table className="hidden w-full text-left text-sm md:table">
            <thead>
                <tr className="text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                    <th scope="col" className="px-5 py-3">
                        Rank
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Level
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Requirements
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>

            <tbody>
                {levels.map((level) => (
                    <tr
                        key={level.id}
                        className="border-gold-400/10 border-t transition-colors hover:bg-white/[0.03]"
                    >
                        <td className="px-5 py-4">
                            <RankBadge rankOrder={level.rank_order} />
                        </td>
                        <th
                            scope="row"
                            className="font-display px-5 py-4 text-base font-extrabold tracking-wide text-white uppercase"
                        >
                            {level.name}
                        </th>
                        <td className="px-5 py-4">
                            <RequirementList level={level} />
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex justify-end">
                                <LevelActions level={level} showLabels />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function MembershipLevelsSection({
    levels,
}: {
    levels: MembershipLevel[];
}) {
    const nextRankOrder =
        levels.reduce(
            (highest, level) => Math.max(highest, level.rank_order),
            0,
        ) + 1;

    return (
        <SectionCard
            title="Membership levels"
            description={
                levels.length === 0
                    ? 'The ladder members climb'
                    : `${levels.length} level${levels.length === 1 ? '' : 's'}, lowest rank first`
            }
            action={<LevelFormDialog nextRankOrder={nextRankOrder} />}
        >
            {levels.length === 0 ? (
                <EmptyState
                    icon={Trophy}
                    title="No levels yet"
                    description="Add the first level members work toward."
                />
            ) : (
                <>
                    <LevelCards levels={levels} />
                    <LevelTable levels={levels} />
                </>
            )}
        </SectionCard>
    );
}
