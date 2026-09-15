import { Head } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import EligibleGamesTable, {
    type PlayedGame,
} from '@/components/eligible-games-table';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import ProgressRequirements from '@/components/progress-requirements';
import { index as progress } from '@/routes/progress';
import type { MembershipLevel, RequirementProgress } from '@/types';

/**
 * What the assessment is waiting on, said in the terms the member can act on:
 * the games still to play, or that it is theirs to take.
 */
function AssessmentPanel({
    requirements,
}: {
    requirements: RequirementProgress[];
}) {
    const assessment = requirements.find((one) => one.progress === null);

    if (!assessment) {
        return null;
    }

    const counted = requirements.find((one) => one.progress !== null);

    return (
        <section className="bg-ink-900/60 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white">Assessment</h2>

            <p className="text-muted-foreground mt-2 text-sm">
                {assessment.is_locked && counted
                    ? `Unlocks once you complete ${counted.int_value} eligible games at any chapter.`
                    : 'Yours to take — ask a master facilitator at your next session.'}
            </p>
        </section>
    );
}

export default function Progress({
    level,
    requirements,
    games,
}: {
    /** The level being worked toward, or null at the top of the ladder. */
    level: MembershipLevel | null;
    requirements: RequirementProgress[];
    games: PlayedGame[];
}) {
    return (
        <>
            <Head title="My progress" />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow="Progression"
                    title={level ? `Toward ${level.name}` : 'Your progress'}
                    description="Requirements are configured by the club, not hardcoded."
                />

                {level === null ? (
                    <div className="bg-ink-900/60 rounded-xl">
                        <EmptyState
                            icon={Trophy}
                            title="Nothing to work toward yet"
                            description="The club sets the levels members climb. When the next one is set, what it asks for shows up here."
                        />
                    </div>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
                        <EligibleGamesTable
                            games={games}
                            levelName={level.name}
                        />

                        <div className="flex flex-col gap-6">
                            <ProgressRequirements
                                levelName={level.name}
                                requirements={requirements}
                            />

                            <AssessmentPanel requirements={requirements} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Progress.layout = {
    breadcrumbs: [
        {
            title: 'My progress',
            href: progress(),
        },
    ],
};
