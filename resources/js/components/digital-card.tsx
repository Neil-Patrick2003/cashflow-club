import { formatMonthYear } from '@/lib/format';
import type { MembershipCard } from '@/types';

/**
 * The card itself: the club's lockup, who the member is, and the code the
 * door scans. Laid out as a card in the hand rather than a panel on a page,
 * so it reads the same way on a phone held up at the desk.
 */
export default function DigitalCard({
    card,
    qr,
    name,
    level,
    memberSince,
}: {
    card: MembershipCard;
    /** The QR rendered by the server, as inline SVG. */
    qr: string;
    name: string;
    level: string | null;
    memberSince: string;
}) {
    return (
        <article className="border-royal-700/40 from-royal-950/60 to-ink-900/60 rounded-2xl border bg-gradient-to-b p-5 md:p-6">
            <header className="flex items-center gap-3">
                <img
                    src="/cashflow-logo-96.png"
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-xl"
                />

                <div className="min-w-0">
                    <p className="truncate font-bold text-white">
                        Philippine Cashflow Club
                    </p>
                    <p className="text-gold-400 mt-0.5 text-[0.625rem] font-bold tracking-[0.22em] uppercase">
                        Digital membership card
                    </p>
                </div>
            </header>

            <h2 className="font-display mt-6 text-3xl leading-none font-extrabold tracking-wide text-white">
                {name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
                {level && (
                    <span className="inline-flex items-center rounded-full bg-white/8 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-white/75 uppercase">
                        {level}
                    </span>
                )}

                <p className="text-muted-foreground text-sm">
                    Member since {formatMonthYear(memberSince)}
                </p>
            </div>

            {/* The code is the point of the card, so it is given the room and
                the only white surface on the page. */}
            <div
                aria-label="Your membership QR code"
                role="img"
                className="mx-auto mt-6 aspect-square w-full max-w-[17rem] rounded-2xl bg-white p-4 [&_svg]:size-full"
                dangerouslySetInnerHTML={{ __html: qr }}
            />

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                <span className="tracking-[0.18em]">{card.number}</span>

                {card.chapter && (
                    <span>Home chapter · {card.chapter.name}</span>
                )}
            </footer>
        </article>
    );
}
