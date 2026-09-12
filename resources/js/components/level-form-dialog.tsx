import { Pencil, Plus } from 'lucide-react';
import MembershipLevelController from '@/actions/App/Http/Controllers/Configuration/MembershipLevelController';
import FormDialog, { dialogButtonClasses } from '@/components/form-dialog';
import FormField from '@/components/form-field';
import LevelRequirementsFieldset from '@/components/level-requirements-fieldset';
import RowActionButton from '@/components/row-action-button';
import { Button } from '@/components/ui/button';
import type { MembershipLevel } from '@/types';

/** Add a membership level, or edit the one passed in. */
export default function LevelFormDialog({
    level,
    showLabel = false,
    nextRankOrder = 1,
}: {
    level?: MembershipLevel;
    showLabel?: boolean;
    nextRankOrder?: number;
}) {
    const isEditing = level !== undefined;

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
                        Add level
                    </Button>
                )
            }
            title={isEditing ? 'Edit level' : 'New level'}
            description="Levels are shown to members from the lowest rank order up."
            form={
                isEditing
                    ? MembershipLevelController.update.form(level.id)
                    : MembershipLevelController.store.form()
            }
            submitLabel={isEditing ? 'Save changes' : 'Add level'}
            resetOnSuccess={!isEditing}
        >
            {(errors) => (
                <>
                    <FormField
                        name="name"
                        label="Level name"
                        defaultValue={level?.name}
                        error={errors.name}
                        placeholder="Apprentice"
                        required
                        autoFocus
                    />

                    <FormField
                        name="rank_order"
                        label="Rank order"
                        type="number"
                        min={1}
                        defaultValue={level?.rank_order ?? nextRankOrder}
                        error={errors.rank_order}
                        required
                    />

                    {/* A new level can arrive with its requirements; an
                        existing one edits them from its own row. */}
                    {!isEditing && (
                        <LevelRequirementsFieldset
                            error={
                                Object.entries(errors).find(([field]) =>
                                    field.startsWith('requirements'),
                                )?.[1]
                            }
                        />
                    )}
                </>
            )}
        </FormDialog>
    );
}
