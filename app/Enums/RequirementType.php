<?php

namespace App\Enums;

/**
 * What a level requirement asks of a member.
 */
enum RequirementType: string
{
    /** Attend a number of games that count toward progression. */
    case EligibleGames = 'ELIGIBLE_GAMES';

    /** Pass a facilitator assessment. Pass or fail, so it carries no number. */
    case Assessment = 'ASSESSMENT';

    /**
     * Whether the requirement is measured by a number.
     */
    public function needsValue(): bool
    {
        return $this === self::EligibleGames;
    }

    /**
     * The label shown to admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::EligibleGames => 'Eligible games',
            self::Assessment => 'Facilitator assessment',
        };
    }
}
