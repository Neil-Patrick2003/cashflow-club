<?php

namespace App\Enums;

/**
 * What kind of occasion an event is. Separate from what it holds: any type can
 * carry games, seminars, or both.
 */
enum EventType: string
{
    case GameDay = 'GAME_DAY';

    case SpecialEvent = 'SPECIAL_EVENT';

    case Orientation = 'ORIENTATION';

    /**
     * The label shown to admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::GameDay => 'Game day',
            self::SpecialEvent => 'Special event',
            self::Orientation => 'Orientation',
        };
    }
}
