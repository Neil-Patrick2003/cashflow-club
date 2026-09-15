import { CircleCheck, CircleDashed, Lock } from 'lucide-react';
import { requirementLabel } from '@/lib/membership';
import type { RequirementProgress } from '@/types';

/** Where the member has got to on one requirement, in a word or a count. */
function standing(requirement: RequirementProgress): string {
    if (requirement.progress !== null) {
        return `${requirement.progress}/${requirement.int_value}`;
    }

    return requirement.is_locked ? 'Locked' : 'Ready';
}

function StandingIcon({ requirement }: { requirement: RequirementProgress }) {
    if (requirement.is_met) {
        return (
            <CircleCheck
                aria-hidden="true"
                className="text-gold-400 size-4 shrink-0"
            />
        );
    }

    return requirement.is_locked ? (
        <Lock aria-hidden="true" className="size-4 shrink-0 text-white/25" />
    ) : (
        <CircleDashed
            aria-hidden="true"
            className="size-4 shrink-0 text-white/35"
        />
    );
}

/** What the level asks for, and how far along the member is on each. */
export default function ProgressRequirements({
    levelName,
    requirements,
}: {
    levelName: string;
    requirements: RequirementProgress[];
}) {
    return (
        <section className="bg-ink-900/60 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white">
                {levelName} requirements
            </h2>

            {requirements.length === 0 ? (
                <p className="text-muted-foreground mt-2 text-sm">
                    The club has not set what this level asks for yet.
                </p>
            ) : (
                <ul className="mt-4 flex flex-col gap-3">
                    {requirements.map((requirement) => (
                        <li
                            key={requirement.id}
                            className="flex items-center gap-3"
                        >
                            <StandingIcon requirement={requirement} />

                            <span className="min-w-0 flex-1 truncate text-white">
                                {requirementLabel(requirement)}
                            </span>

                            <span
                                className={
                                    requirement.is_met
                                        ? 'text-gold-400 shrink-0 text-sm font-bold'
                                        : 'text-muted-foreground shrink-0 text-sm'
                                }
                            >
                                {standing(requirement)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
