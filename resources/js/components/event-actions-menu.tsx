import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EventDeleteDialog from '@/components/event-delete-dialog';
import EventFormDialog from '@/components/event-form-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Chapter, Event } from '@/types';

type EventAction = 'edit' | 'delete';

/**
 * What you can do to the event itself. Scheduling what goes inside it has its
 * own button at the foot of the card.
 */
export default function EventActionsMenu({
    event,
    chapters,
}: {
    event: Event;
    chapters: Chapter[];
}) {
    const [action, setAction] = useState<EventAction | null>(null);

    function close(open: boolean): void {
        if (!open) {
            setAction(null);
        }
    }

    return (
        <>
            {/* The dialogs sit outside the menu so closing it does not unmount
                them, and the menu is non-modal so the two never argue over the
                page's pointer events on the way through. */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${event.title}`}
                        className="size-11 shrink-0 text-white/60 hover:text-white md:size-9"
                    >
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={() => setAction('edit')}>
                        <Pencil />
                        Edit event
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setAction('delete')}
                    >
                        <Trash2 />
                        Delete event
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EventFormDialog
                chapters={chapters}
                event={event}
                open={action === 'edit'}
                onOpenChange={close}
            />

            <EventDeleteDialog
                event={event}
                open={action === 'delete'}
                onOpenChange={close}
            />
        </>
    );
}
