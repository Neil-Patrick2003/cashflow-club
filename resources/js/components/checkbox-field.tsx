import { useState } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * A boolean field that always submits a value. Radix's checkbox sends nothing
 * when it is off, so the hidden input carries `1` or `0` either way.
 */
export default function CheckboxField({
    name,
    label,
    description,
    defaultChecked = false,
    error,
}: {
    name: string;
    label: string;
    description?: string;
    defaultChecked?: boolean;
    error?: string;
}) {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    return (
        <div className="grid gap-2">
            <div className="border-gold-400/10 flex items-start gap-3 rounded-lg border bg-white/[0.02] p-3">
                <input
                    type="hidden"
                    name={name}
                    value={isChecked ? '1' : '0'}
                />

                <Checkbox
                    id={name}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                        setIsChecked(checked === true)
                    }
                    className="mt-0.5"
                />

                <div className="grid gap-1 leading-none">
                    <Label htmlFor={name}>{label}</Label>

                    {description && (
                        <p className="text-muted-foreground text-sm">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
}
