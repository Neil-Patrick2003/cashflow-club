import type { ReactNode } from 'react';

/**
 * The landing page's title treatment: gold eyebrow over a condensed heading.
 * An action stacks under the heading on a phone and sits beside it from `md`
 * up, the same way a section's action does.
 */
export default function PageHeader({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                {eyebrow && (
                    <p className="text-gold-400 text-[0.625rem] font-bold tracking-[0.22em] uppercase">
                        {eyebrow}
                    </p>
                )}

                <h1 className="font-display mt-2 text-3xl leading-none font-extrabold tracking-wide text-white uppercase md:text-4xl">
                    {title}
                </h1>

                {description && (
                    <p className="text-muted-foreground mt-3 max-w-prose text-sm">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </header>
    );
}
