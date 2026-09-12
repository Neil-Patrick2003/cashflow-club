import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * The per-row Edit / Delete control. Icon only at a 44px tap size on phones,
 * icon plus label in the wider table.
 */
export default function RowActionButton({
    icon: Icon,
    label,
    showLabel = false,
    tone = 'default',
    className,
    ...props
}: ComponentProps<typeof Button> & {
    icon: LucideIcon;
    label: string;
    showLabel?: boolean;
    tone?: 'default' | 'destructive';
}) {
    return (
        <Button
            variant="ghost"
            size={showLabel ? 'sm' : 'icon'}
            aria-label={label}
            className={cn(
                tone === 'destructive'
                    ? 'text-destructive-foreground/80 hover:text-destructive-foreground'
                    : 'text-white/60 hover:text-white',
                !showLabel && 'size-11',
                className,
            )}
            {...props}
        >
            <Icon />
            {showLabel && label}
        </Button>
    );
}
