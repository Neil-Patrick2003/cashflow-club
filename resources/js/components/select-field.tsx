import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/** Label, select and error for one field, at a thumb-sized height on phones. */
export default function SelectField({
    name,
    label,
    value,
    onValueChange,
    options,
    error,
}: {
    name: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>

            <Select name={name} value={value} onValueChange={onValueChange}>
                <SelectTrigger id={name} className="h-11 w-full md:h-10">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <InputError message={error} />
        </div>
    );
}
