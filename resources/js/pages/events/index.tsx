import { Head } from '@inertiajs/react';
import EventCalendarSection from '@/components/event-calendar-section';
import EventFormDialog from '@/components/event-form-dialog';
import PageHeader from '@/components/page-header';
import { index as events } from '@/routes/events';
import type { Chapter, Event, Facilitator } from '@/types';

export default function Events({
    events: items,
    chapters,
    facilitators,
}: {
    events: Event[];
    chapters: Chapter[];
    facilitators: Facilitator[];
}) {
    return (
        <>
            <Head title="Events" />

            <div className="flex h-full flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-8">
                <PageHeader
                    eyebrow="Club"
                    title="Events"
                    description="Game days and seminars still to come, per chapter, soonest first. Schedule what happens inside one from its own card."
                    action={<EventFormDialog chapters={chapters} />}
                />

                <EventCalendarSection
                    events={items}
                    chapters={chapters}
                    facilitators={facilitators}
                />
            </div>
        </>
    );
}

Events.layout = {
    breadcrumbs: [
        {
            title: 'Events',
            href: events(),
        },
    ],
};
