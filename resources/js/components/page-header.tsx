/** The landing page's title treatment: gold eyebrow over a condensed heading. */
export default function PageHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
}) {
    return (
        <header>
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
        </header>
    );
}
