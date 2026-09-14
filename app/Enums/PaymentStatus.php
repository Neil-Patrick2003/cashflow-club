<?php

namespace App\Enums;

/**
 * Where a payment has got to. Every payment opens pending and stays there
 * until the money is actually in.
 */
enum PaymentStatus: string
{
    case Pending = 'PENDING';

    case Paid = 'PAID';

    /**
     * The label shown to members and admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Paid => 'Paid',
        };
    }
}
