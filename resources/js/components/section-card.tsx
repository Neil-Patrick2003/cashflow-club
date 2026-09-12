import type { ReactNode } from 'react';

/**
 * One configuration section: a titled panel whose action stacks under the
 * heading on a phone and sits beside it from `md` up.
 */
export default function SectionCard({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="border-gold-400/10 bg-ink-900/40 overflow-hidden rounded-xl border">
            <header className="border-gold-400/10 flex flex-col gap-4 border-b px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
                <div>
                    <h2 className="font-display text-xl font-extrabold tracking-wide text-white uppercase">
                        {title}
                    </h2>

                    {description && (
                        <p className="text-muted-foreground mt-1 text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {action}
            </header>

            {children}
        </section>
    );
}
