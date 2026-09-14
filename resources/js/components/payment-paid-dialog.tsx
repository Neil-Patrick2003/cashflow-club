import { BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import FormDialog from '@/components/form-dialog';
import RowActionButton from '@/components/row-action-button';
import SelectField from '@/components/select-field';
import { formatPeso } from '@/lib/format';
import type { Payment, PaymentMethod, SeatPayment } from '@/types';

const methodOptions: { value: PaymentMethod; label: string }[] = [
    { value: 'CASH', label: 'Cash' },
    { value: 'BANK_TRANSFER', label: 'Bank transfer' },
    { value: 'GCASH', label: 'GCash' },
];

/**
 * Records that the money for one seat is in, and how it came in. Cash is the
 * default because it is what the club takes at the door.
 */
export default function PaymentPaidDialog({
    seat,
    payment,
    showLabel = false,
}: {
    seat: SeatPayment;
    payment: Payment;
    showLabel?: boolean;
}) {
    const [method, setMethod] = useState<PaymentMethod>('CASH');

    return (
        <FormDialog
            trigger={
                <RowActionButton
                    icon={BadgeCheck}
                    label="Mark paid"
                    showLabel={showLabel}
                />
            }
            title={`Mark ${formatPeso(payment.amount)} as paid?`}
            description={`${seat.user.name} settling ${seat.game.code}. Record how the money came in.`}
            form={PaymentController.update.form(payment.id)}
            submitLabel="Mark as paid"
        >
            {(errors) => (
                <SelectField
                    name="method"
                    label="How it was paid"
                    value={method}
                    onValueChange={(value) => setMethod(value as PaymentMethod)}
                    options={methodOptions}
                    error={errors.method}
                />
            )}
        </FormDialog>
    );
}
