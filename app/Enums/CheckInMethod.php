<?php

namespace App\Enums;

/**
 * How the club recorded that someone turned up. A scan is the door's own
 * reading of a membership QR; anything the club had to enter itself is manual.
 */
enum CheckInMethod: string
{
    /** Read off the member's own card at the door. */
    case Qr = 'QR';

    /** Ticked off the roster by hand, for a card that would not scan.  */
    case Manual = 'MANUAL';

    /**
     * The label shown to admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::Qr => 'QR scan',
            self::Manual => 'Manual',
        };
    }
}
