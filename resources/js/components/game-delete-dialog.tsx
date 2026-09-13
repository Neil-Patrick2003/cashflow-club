import { Trash2 } from 'lucide-react';
import GameController from '@/actions/App/Http/Controllers/Events/GameController';
import FormDialog from '@/components/form-dialog';
import RowActionButton from '@/components/row-action-button';
import type { Game } from '@/types';

export default function GameDeleteDialog({
    game,
    showLabel = false,
}: {
    game: Game;
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
            title={`Delete ${game.code}?`}
            description="The game is removed from this event."
            form={GameController.destroy.form(game.id)}
            submitLabel="Delete game"
            submitVariant="destructive"
        />
    );
}
