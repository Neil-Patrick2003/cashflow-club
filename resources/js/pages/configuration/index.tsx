import { Head } from '@inertiajs/react';
import ChaptersSection from '@/components/chapters-section';
import PageHeader from '@/components/page-header';
import { index as configuration } from '@/routes/configuration';
import type { Chapter } from '@/types';

export default function Configuration({ chapters }: { chapters: Chapter[] }) {
    return (
        <>
            <Head title="Configuration" />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow="System"
                    title="Configuration"
                    description="Set up the pieces the club runs on. Changes here apply across the whole system."
                />

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
