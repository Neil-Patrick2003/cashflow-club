export type RequirementType = 'ELIGIBLE_GAMES' | 'ASSESSMENT';

/** One condition on a membership level. */
export type LevelRequirement = {
    id: number;
    level_id: number;
    type: RequirementType;
    /** The threshold for ELIGIBLE_GAMES; null for pass/fail requirements. */
    int_value: number | null;
    created_at: string;
    updated_at: string;
};

/** A membership level members progress through, lowest rank order first. */
export type MembershipLevel = {
    id: number;
    name: string;
    rank_order: number;
    requirements: LevelRequirement[];
    created_at: string;
    updated_at: string;
};
