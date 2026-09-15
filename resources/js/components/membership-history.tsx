import { formatMonthYear } from '@/lib/format';
import { cn } from '@/lib/utils';

/** One step in how the member's standing got to where it is. */
function Entry({
    title,
    detail,
    isCurrent = false,
}: {
    title: string;
    detail: string;
    isCurrent?: boolean;
}) {
    return (
        <li className="flex gap-3">
            <span
                aria-hidden="true"
                className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    isCurrent ? 'bg-gold-400' : 'bg-royal-700',
                )}
            />

            <div className="min-w-0">
                <p className="font-semibold text-white">{title}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">{detail}</p>
            </div>
        </li>
    );
}

/**
 * How the member's standing has run, read off what the club records today:
 * when they joined and the level they hold now. Once levels can be changed,
 * this wants a real record of each change rather than the join date.
 */
export default function MembershipHistory({
    level,
    memberSince,
    chapter,
}: {
    level: string | null;
    memberSince: string;
    chapter: string | null;
}) {
    const joined = formatMonthYear(memberSince);

    return (
        <section className="bg-ink-900/60 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white">Membership history</h2>

            <ul className="mt-4 flex flex-col gap-4">
                {level && (
                    <Entry
                        isCurrent
                        title={`${level} — current`}
                        detail={`Active since ${joined}`}
                    />
                )}

                <Entry
                    title={level ?? 'Member'}
                    detail={
                        chapter
                            ? `Joined ${joined} · ${chapter}`
                            : `Joined ${joined}`
                    }
                />
            </ul>
        </section>
    );
}
