import { Trash2 } from 'lucide-react';
import MembershipLevelController from '@/actions/App/Http/Controllers/Configuration/MembershipLevelController';
import FormDialog from '@/components/form-dialog';
import RowActionButton from '@/components/row-action-button';
import type { MembershipLevel } from '@/types';

export default function LevelDeleteDialog({
    level,
    showLabel = false,
}: {
    level: MembershipLevel;
    showLabel?: boolean;
}) {
    return (
        <FormDialog
            trigger={
                <RowActionButton
                    icon={Trash2}
                    label="Delete"
                    showLabel={showLabel}
                    tone="destructive"
                />
            }
            title={`Delete ${level.name}?`}
            description="The level and its requirements are removed from the system."
            form={MembershipLevelController.destroy.form(level.id)}
            submitLabel="Delete level"
            submitVariant="destructive"
        />
    );
}
