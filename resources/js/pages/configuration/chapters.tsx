import { Head } from '@inertiajs/react';
import ChaptersSection from '@/components/chapters-section';
import { index as chapters } from '@/routes/chapters';
import { index as configuration } from '@/routes/configuration';
import type { Chapter } from '@/types';

export default function Chapters({ chapters: items }: { chapters: Chapter[] }) {
    return (
        <>
            <Head title="Chapters" />

            <ChaptersSection chapters={items} />
        </>
    );
}

Chapters.layout = {
    breadcrumbs: [
        {
            title: 'Configuration',
            href: configuration(),
        },
        {
            title: 'Chapters',
            href: chapters(),
        },
    ],
};
