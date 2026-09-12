import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

/**
 * Shared look for every control inside the auth card: a tall, softly
 * translucent pill that leaves room on the left for the field's icon.
 */
export const authControlClassName =
    'h-12 rounded-lg border-white/15 bg-white/5 pl-11 text-sm text-white shadow-none placeholder:text-white/45 focus-visible:border-gold-400/70 focus-visible:ring-gold-400/25';

/** Gold inline links, so they read against the dark card. */
export const authLinkClassName =
    'text-gold-400 decoration-gold-400/40 hover:decoration-gold-400!';

type Props = {
    htmlFor: string;
    label: string;
    icon: LucideIcon;
    error?: string;
    children: ReactNode;
};

/**
 * A labelled auth input. The label is visually hidden because the design
 * relies on placeholders, but it stays available to screen readers.
 */
export default function AuthField({
    htmlFor,
    label,
    icon: Icon,
    error,
    children,
}: Props) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlFor} className="sr-only">
                {label}
            </Label>

            <div className="relative">
                <Icon
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/50"
                />
                {children}
            </div>

            <InputError message={error} />
        </div>
    );
}
