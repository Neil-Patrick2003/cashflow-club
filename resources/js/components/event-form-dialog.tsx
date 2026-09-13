import { Plus } from 'lucide-react';
import { useState } from 'react';
import EventController from '@/actions/App/Http/Controllers/Events/EventController';
import FormDialog, { dialogButtonClasses } from '@/components/form-dialog';
import FormField from '@/components/form-field';
import SelectField from '@/components/select-field';
import { Button } from '@/components/ui/button';
import { toDateInputValue } from '@/lib/format';
import type { Chapter, Event, EventType } from '@/types';

const typeOptions: { value: EventType; label: string }[] = [
    { value: 'GAME_DAY', label: 'Game day' },
    { value: 'SPECIAL_EVENT', label: 'Special event' },
    { value: 'ORIENTATION', label: 'Orientation' },
];

/**
 * Add an event to the calendar from its own button, or edit the one passed in,
 * opened by that event's actions menu through `open`.
 */
export default function EventFormDialog({
    chapters,
    event,
    open,
    onOpenChange,
}: {
    chapters: Chapter[];
    event?: Event;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const isEditing = event !== undefined;
    const [chapterId, setChapterId] = useState(
        String(event?.chapter_id ?? chapters[0]?.id ?? ''),
    );
    const [type, setType] = useState<EventType>(event?.type ?? 'GAME_DAY');

    return (
        <FormDialog
            trigger={
                !isEditing && (
                    <Button className={dialogButtonClasses}>
                        <Plus />
                        Add event
                    </Button>
                )
            }
            open={open}
            onOpenChange={onOpenChange}
            title={isEditing ? 'Edit event' : 'New event'}
            description="An event runs on one date, in one chapter. Schedule games and seminars inside it once it is saved."
            form={
                isEditing
                    ? EventController.update.form(event.id)
                    : EventController.store.form()
            }
            submitLabel={isEditing ? 'Save changes' : 'Add event'}
            resetOnSuccess={!isEditing}
        >
            {(errors) => (
                <>
                    <FormField
                        name="title"
                        label="Title"
                        defaultValue={event?.title}
                        error={errors.title}
                        placeholder="November Cashflow Day"
                        required
                        autoFocus
                    />

                    <SelectField
                        name="chapter_id"
                        label="Chapter"
                        value={chapterId}
                        onValueChange={setChapterId}
                        options={chapters.map((chapter) => ({
                            value: String(chapter.id),
                            label: chapter.name,
                        }))}
                        error={errors.chapter_id}
                    />

                    <SelectField
                        name="type"
                        label="Type"
                        value={type}
                        onValueChange={(value) => setType(value as EventType)}
                        options={typeOptions}
                        error={errors.type}
                    />

                    <FormField
                        name="date"
                        label="Date"
                        type="date"
                        defaultValue={
                            event ? toDateInputValue(event.date) : undefined
                        }
                        error={errors.date}
                        required
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            name="start_time"
                            label="Starts"
                            type="time"
                            defaultValue={event?.start_time ?? '13:00'}
                            error={errors.start_time}
                            required
                        />

                        <FormField
                            name="end_time"
                            label="Ends"
                            type="time"
                            defaultValue={event?.end_time ?? '18:00'}
                            error={errors.end_time}
                            required
                        />
                    </div>
                </>
            )}
        </FormDialog>
    );
}
