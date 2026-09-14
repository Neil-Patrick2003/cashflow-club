import { Link } from '@inertiajs/react';
import { index as games } from '@/routes/games';
import { cn } from '@/lib/utils';
import type { Chapter } from '@/types';

/* Gold marks the chapter being read, the same way it marks everything else a
   member has acted on. */
function ChapterPill({
    href,
    isSelected,
    children,
}: {
    href: ReturnType<typeof games>;
    isSelected: boolean;
    children: string;
}) {
    return (
        <li>
            <Link
                href={href}
                /* The schedule is the only thing that changes, so the rest of
                   the page is left where the member had it. */
                only={['games', 'chapter']}
                preserveScroll
                preserveState
                prefetch
                aria-current={isSelected ? 'page' : undefined}
                className={cn(
                    'inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                    isSelected
                        ? 'border-gold-400/40 bg-gold-400/10 text-gold-400'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white',
                )}
            >
                {children}
            </Link>
        </li>
    );
}

/**
 * Narrows the schedule to one chapter. Only chapters with a game still to come
 * are listed, so every pill leads somewhere.
 */
export default function ChapterFilter({
    chapters,
    selected,
}: {
    chapters: Chapter[];
    selected: number | null;
}) {
    if (chapters.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Filter games by chapter">
            <ul className="flex flex-wrap gap-2">
                <ChapterPill href={games()} isSelected={selected === null}>
                    All chapters
                </ChapterPill>

                {chapters.map((chapter) => (
                    <ChapterPill
                        key={chapter.id}
                        href={games({ query: { chapter: chapter.id } })}
                        isSelected={selected === chapter.id}
                    >
                        {chapter.name}
                    </ChapterPill>
                ))}
            </ul>
        </nav>
    );
}
