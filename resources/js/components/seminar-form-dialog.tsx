import { Pencil } from 'lucide-react';
import SeminarController from '@/actions/App/Http/Controllers/Events/SeminarController';
import CheckboxField from '@/components/checkbox-field';
import FormDialog from '@/components/form-dialog';
import FormField from '@/components/form-field';
import RowActionButton from '@/components/row-action-button';
import type { Event, Seminar } from '@/types';

/**
 * Edit the seminar passed in, opening from its own pencil, or add a new one to
 * the event, opened by the event's Add menu through `open`.
 */
export default function SeminarFormDialog({
    event,
    seminar,
    showLabel = false,
    open,
    onOpenChange,
}: {
    event: Event;
    seminar?: Seminar;
    showLabel?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const isEditing = seminar !== undefined;

    return (
        <FormDialog
            trigger={
                isEditing && (
                    <RowActionButton
                        icon={Pencil}
                        label="Edit"
                        showLabel={showLabel}
                    />
                )
            }
            open={open}
            onOpenChange={onOpenChange}
            title={isEditing ? 'Edit seminar' : 'New seminar'}
            description="Seminars run on the event's date, at the time you set here."
            form={
                isEditing
                    ? SeminarController.update.form(seminar.id)
                    : SeminarController.store.form(event.id)
            }
            submitLabel={isEditing ? 'Save changes' : 'Add seminar'}
            resetOnSuccess={!isEditing}
        >
            {(errors) => (
                <>
                    <FormField
                        name="title"
                        label="Title"
                        defaultValue={seminar?.title}
                        error={errors.title}
                        placeholder="Building your first passive income"
                        required
                        autoFocus
                    />

                    <FormField
                        name="starts_at"
                        label="Starts"
                        type="time"
                        defaultValue={seminar?.starts_at ?? '10:00'}
                        error={errors.starts_at}
                        required
                    />

                    <FormField
                        name="capacity"
                        label="Seats"
                        type="number"
                        min={1}
                        defaultValue={seminar?.capacity ?? '40'}
                        error={errors.capacity}
                        required
                    />

                    <CheckboxField
                        name="member_only"
                        label="Members only"
                        description="Non-members cannot register for this seminar."
                        defaultChecked={seminar?.member_only ?? false}
                        error={errors.member_only}
                    />
                </>
            )}
        </FormDialog>
    );
}
