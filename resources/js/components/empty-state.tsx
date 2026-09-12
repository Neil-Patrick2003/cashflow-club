import type { LucideIcon } from 'lucide-react';

/** What a section shows before it holds anything. */
export default function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="px-4 py-12 text-center md:py-16">
            <Icon
                aria-hidden="true"
                className="text-gold-400/60 mx-auto size-6"
            />

            <p className="mt-3 font-semibold text-white">{title}</p>

            <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
                {description}
            </p>
        </div>
    );
}
