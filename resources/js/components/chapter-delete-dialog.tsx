import { Trash2 } from 'lucide-react';
import ChapterController from '@/actions/App/Http/Controllers/Configuration/ChapterController';
import FormDialog from '@/components/form-dialog';
import RowActionButton from '@/components/row-action-button';
import type { Chapter } from '@/types';

export default function ChapterDeleteDialog({
    chapter,
    showLabel = false,
}: {
    chapter: Chapter;
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
            title={`Delete ${chapter.name}?`}
            description="The chapter is removed from the system. Close it instead if you only want to stop offering it to members."
            form={ChapterController.destroy.form(chapter.id)}
            submitLabel="Delete chapter"
            submitVariant="destructive"
        />
    );
}
