import { cn } from '@/lib/utils';

/** Gold when something is live, quiet grey when it is only on record. */
export default function StatusPill({
    isActive,
    activeLabel = 'Active',
    inactiveLabel = 'Inactive',
    className,
}: {
    isActive: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase',
                isActive
                    ? 'border-gold-400/30 bg-gold-400/10 text-gold-400'
                    : 'border-white/10 bg-white/5 text-white/45',
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    'size-1.5 rounded-full',
                    isActive ? 'bg-gold-400' : 'bg-white/35',
                )}
            />
            {isActive ? activeLabel : inactiveLabel}
        </span>
    );
}
