import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import PageHeader from '@/components/page-header';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { index as chapters } from '@/routes/chapters';
import { index as membershipLevels } from '@/routes/membership-levels';
import type { NavItem } from '@/types';

const tabs: NavItem[] = [
    {
        title: 'Chapters',
        href: chapters(),
    },
    {
        title: 'Membership levels',
        href: membershipLevels(),
    },
];

/** The header and tab bar every configuration page sits under. */
export default function ConfigurationLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
            <PageHeader
                eyebrow="System"
                title="Configuration"
                description="Set up the pieces the club runs on. Changes here apply across the whole system."
            />

            {/* Full-bleed and scrollable on a phone, so a long tab list never
                squeezes the labels. */}
            <nav
                aria-label="Configuration"
                className="border-gold-400/10 -mx-4 flex gap-1 overflow-x-auto border-b px-4 md:mx-0 md:px-0"
            >
                {tabs.map((tab) => {
                    const isCurrent = isCurrentOrParentUrl(tab.href);

                    return (
                        <Link
                            key={toUrl(tab.href)}
                            href={tab.href}
                            prefetch
                            aria-current={isCurrent ? 'page' : undefined}
                            className={cn(
                                'shrink-0 border-b-2 px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
                                isCurrent
                                    ? 'border-gold-400 text-gold-400'
                                    : 'border-transparent text-white/55 hover:text-white',
                            )}
                        >
                            {tab.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="space-y-6 md:space-y-8">{children}</div>
        </div>
    );
}
