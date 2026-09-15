import type { LevelRequirement } from '@/types';

/** How one requirement reads: `10 eligible games`, or its own name. */
export function requirementLabel(requirement: LevelRequirement): string {
    return requirement.type === 'ELIGIBLE_GAMES'
        ? `${requirement.int_value} eligible games`
        : 'Facilitator assessment';
}
