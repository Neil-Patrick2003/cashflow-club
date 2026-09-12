import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import LevelRequirementController from '@/actions/App/Http/Controllers/Configuration/LevelRequirementController';
import FormDialog from '@/components/form-dialog';
import FormField from '@/components/form-field';
import SelectField from '@/components/select-field';
import { Button } from '@/components/ui/button';
import type {
    LevelRequirement,
    MembershipLevel,
    RequirementType,
} from '@/types';

export const requirementOptions: { value: RequirementType; label: string }[] = [
    { value: 'ELIGIBLE_GAMES', label: 'Eligible games' },
    { value: 'ASSESSMENT', label: 'Facilitator assessment' },
];

/**
 * Add a requirement to a level, or edit an existing one. Only the counted
 * requirement carries a number, so the threshold field follows the type.
 */
export default function RequirementFormDialog({
    level,
    requirement,
}: {
    level: MembershipLevel;
    requirement?: LevelRequirement;
}) {
    const isEditing = requirement !== undefined;
    const [type, setType] = useState<RequirementType>(
        requirement?.type ?? 'ELIGIBLE_GAMES',
    );

    return (
        <FormDialog
            trigger={
                isEditing ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit requirement"
                        className="size-7 text-white/50 hover:text-white [&>svg]:size-3.5"
                    >
                        <Pencil />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gold-400 hover:text-gold-300 h-9"
                    >
                        <Plus />
                        Add requirement
                    </Button>
                )
            }
            title={isEditing ? 'Edit requirement' : 'New requirement'}
            description={`What ${level.name} asks of a member before they reach it.`}
            form={
                isEditing
                    ? LevelRequirementController.update.form(requirement.id)
                    : LevelRequirementController.store.form(level.id)
            }
            submitLabel={isEditing ? 'Save changes' : 'Add requirement'}
            resetOnSuccess={!isEditing}
        >
            {(errors) => (
                <>
                    <SelectField
                        name="type"
                        label="Requirement"
                        value={type}
                        onValueChange={(value) =>
                            setType(value as RequirementType)
                        }
                        options={requirementOptions}
                        error={errors.type}
                    />

                    {type === 'ELIGIBLE_GAMES' && (
                        <FormField
                            name="int_value"
                            label="Games needed"
                            type="number"
                            min={1}
                            defaultValue={requirement?.int_value ?? ''}
                            error={errors.int_value}
                            placeholder="10"
                            required
                        />
                    )}
                </>
            )}
        </FormDialog>
    );
}
