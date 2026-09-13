<?php

namespace App\Enums;

/**
 * SRT is a variation of a game, not a parallel system.
 *
 * A REGULAR session is the chapter's bread and butter: free for members, paid
 * by non-members, larger capacity, no table structure and no master
 * facilitator. An SRT session is the premium facilitated one: everyone pays,
 * vouchers are accepted, the smaller capacity is split into tables of four, and
 * it runs under a master facilitator.
 */
enum GameType: string
{
    case Regular = 'REGULAR';

    case Srt = 'SRT';

    /**
     * Whether the session runs under a master facilitator and seated tables.
     */
    public function isFacilitated(): bool
    {
        return $this === self::Srt;
    }

    /**
     * The label shown to admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::Regular => 'Regular',
            self::Srt => 'SRT',
        };
    }
}
