import { Head } from '@inertiajs/react';
import ChaptersSection from '@/components/chapters-section';
import { index as configuration } from '@/routes/configuration';
import type { Chapter } from '@/types';

export default function Configuration({ chapters }: { chapters: Chapter[] }) {
    return (
        <>
            <Head title="Configuration" />

            {/* Phone padding first, roomier from `md` up. */}
            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <header>
                    <p className="text-gold-400 text-[0.625rem] font-bold tracking-[0.22em] uppercase">
                        System
                    </p>
                    <h1 className="font-display mt-2 text-3xl leading-none font-extrabold tracking-wide text-white uppercase md:text-4xl">
                        Configuration
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-prose text-sm">
                        Set up the pieces the club runs on. Changes here apply
                        across the whole system.
                    </p>
                </header>

                <div className="space-y-6 md:space-y-8">
                    <ChaptersSection chapters={chapters} />
                </div>
            </div>
        </>
    );
}

Configuration.layout = {
    breadcrumbs: [
        {
            title: 'Configuration',
            href: configuration(),
        },
    ],
};
