import type { ComponentProps } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Label, input and error for one field, at a thumb-sized height on phones. */
export default function FormField({
    name,
    label,
    error,
    className,
    ...props
}: ComponentProps<typeof Input> & {
    name: string;
    label: string;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>

            <Input
                id={name}
                name={name}
                className={cn('h-11 md:h-10', className)}
                {...props}
            />

            <InputError message={error} />
        </div>
    );
}
