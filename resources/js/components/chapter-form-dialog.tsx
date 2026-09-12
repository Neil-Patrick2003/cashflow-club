import { Pencil, Plus } from 'lucide-react';
import ChapterController from '@/actions/App/Http/Controllers/Configuration/ChapterController';
import CheckboxField from '@/components/checkbox-field';
import FormDialog, { dialogButtonClasses } from '@/components/form-dialog';
import FormField from '@/components/form-field';
import RowActionButton from '@/components/row-action-button';
import { Button } from '@/components/ui/button';
import type { Chapter } from '@/types';

/** Add a chapter, or edit the one passed in: same fields, same dialog. */
export default function ChapterFormDialog({
    chapter,
    showLabel = false,
}: {
    chapter?: Chapter;
    showLabel?: boolean;
}) {
    const isEditing = chapter !== undefined;

    return (
        <FormDialog
            trigger={
                isEditing ? (
                    <RowActionButton
                        icon={Pencil}
                        label="Edit"
                        showLabel={showLabel}
                    />
                ) : (
                    <Button className={dialogButtonClasses}>
                        <Plus />
                        Add chapter
                    </Button>
                )
            }
            title={isEditing ? 'Edit chapter' : 'New chapter'}
            description={
                isEditing
                    ? 'Rename the chapter, move it to another city, or close it to new members.'
                    : 'Chapters group members and sessions by city.'
            }
            form={
                isEditing
                    ? ChapterController.update.form(chapter.id)
                    : ChapterController.store.form()
            }
            submitLabel={isEditing ? 'Save changes' : 'Add chapter'}
            resetOnSuccess={!isEditing}
        >
            {(errors) => (
                <>
                    <FormField
                        name="name"
                        label="Chapter name"
                        defaultValue={chapter?.name}
                        error={errors.name}
                        placeholder="Metro Manila Chapter"
                        required
                        autoFocus
                    />

                    <FormField
                        name="city"
                        label="City"
                        defaultValue={chapter?.city}
                        error={errors.city}
                        placeholder="Quezon City"
                        required
                    />

                    <CheckboxField
                        name="is_active"
                        label="Active"
                        description="Inactive chapters stay on record but are not offered to members."
                        defaultChecked={chapter?.is_active ?? true}
                        error={errors.is_active}
                    />
                </>
            )}
        </FormDialog>
    );
}
