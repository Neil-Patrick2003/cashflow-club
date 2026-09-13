import { Trash2 } from 'lucide-react';
import SeminarController from '@/actions/App/Http/Controllers/Events/SeminarController';
import FormDialog from '@/components/form-dialog';
import RowActionButton from '@/components/row-action-button';
import type { Seminar } from '@/types';

export default function SeminarDeleteDialog({
    seminar,
    showLabel = false,
}: {
    seminar: Seminar;
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
            title={`Delete ${seminar.title}?`}
            description="The seminar is removed from this event."
            form={SeminarController.destroy.form(seminar.id)}
            submitLabel="Delete seminar"
            submitVariant="destructive"
        />
    );
}
