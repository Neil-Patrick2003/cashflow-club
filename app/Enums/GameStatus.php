<?php

namespace App\Enums;

/**
 * Where a game sits in its life cycle.
 */
enum GameStatus: string
{
    /** On the calendar, not yet open for registration. */
    case Scheduled = 'SCHEDULED';

    /** Taking registrations. */
    case Open = 'OPEN';

    /** Played out. */
    case Completed = 'COMPLETED';

    /** Called off. */
    case Cancelled = 'CANCELLED';

    /**
     * The label shown to admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::Scheduled => 'Scheduled',
            self::Open => 'Open',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }
}
