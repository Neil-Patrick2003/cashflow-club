import EventController from '@/actions/App/Http/Controllers/Events/EventController';
import FormDialog from '@/components/form-dialog';
import type { Event } from '@/types';

/** Opened by the event's actions menu, so it carries no trigger of its own. */
export default function EventDeleteDialog({
    event,
    open,
    onOpenChange,
}: {
    event: Event;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={`Delete ${event.title}?`}
            description="The event and everything scheduled inside it are removed from the calendar."
            form={EventController.destroy.form(event.id)}
            submitLabel="Delete event"
            submitVariant="destructive"
        />
    );
}
