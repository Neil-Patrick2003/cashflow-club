<?php

namespace App\Enums;

/**
 * How a person got their seat at a game. Decided by the server at registration
 * time from who they are and what the game costs, and what the payments screen
 * groups by: only Paid rows have money to collect.
 */
enum AccessMethod: string
{
    /** Entry included in their membership. Nothing to pay. */
    case Membership = 'MEMBERSHIP';

    /** Paying for this game: a guest at any game, or anyone at an SRT. */
    case Paid = 'PAID';

    /** Redeemed an SRT voucher instead of paying. */
    case Voucher = 'VOUCHER';

    /**
     * The label shown to members and admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::Membership => 'Membership',
            self::Paid => 'Paid',
            self::Voucher => 'Voucher',
        };
    }
}
