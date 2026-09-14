<?php

namespace App\Enums;

/**
 * How the club took the money for a seat. Recorded by hand in admin once it
 * is in, so the set is what the club actually accepts at the door.
 */
enum PaymentMethod: string
{
    case Cash = 'CASH';

    case BankTransfer = 'BANK_TRANSFER';

    case GCash = 'GCASH';

    /**
     * The label shown to admins.
     */
    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::BankTransfer => 'Bank transfer',
            self::GCash => 'GCash',
        };
    }
}
