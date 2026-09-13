import { Pencil } from 'lucide-react';
import { useState } from 'react';
import GameController from '@/actions/App/Http/Controllers/Events/GameController';
import FormDialog from '@/components/form-dialog';
import FormField from '@/components/form-field';
import RowActionButton from '@/components/row-action-button';
import SelectField from '@/components/select-field';
import type { Event, Facilitator, Game, GameStatus, GameType } from '@/types';

const typeOptions: { value: GameType; label: string }[] = [
    { value: 'REGULAR', label: 'Regular' },
    { value: 'SRT', label: 'SRT' },
];

const statusOptions: { value: GameStatus; label: string }[] = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'OPEN', label: 'Open' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

/* What each type costs and seats by default. Regular sessions are free for
   members and take a bigger room; SRT is paid by everyone and seats tables of
   four under a master facilitator. */
const typeDefaults: Record<
    GameType,
    {
        scheduleAt: string;
        memberPrice: string;
        nonMemberPrice: string;
        capacity: string;
    }
> = {
    REGULAR: {
        scheduleAt: '13:00',
        memberPrice: '0',
        nonMemberPrice: '800',
        capacity: '20',
    },
    SRT: {
        scheduleAt: '09:00',
        memberPrice: '2000',
        nonMemberPrice: '2500',
        capacity: '16',
    },
};

/**
 * Edit the game passed in, opening from its own pencil, or add a new one to
 * the event, opened by the event's Add menu through `open`.
 */
export default function GameFormDialog({
    event,
    facilitators,
    game,
    showLabel = false,
    open,
    onOpenChange,
}: {
    event: Event;
    facilitators: Facilitator[];
    game?: Game;
    showLabel?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const isEditing = game !== undefined;
    const [type, setType] = useState<GameType>(game?.type ?? 'REGULAR');
    const [status, setStatus] = useState<GameStatus>(
        game?.status ?? 'SCHEDULED',
    );
    const [facilitatorId, setFacilitatorId] = useState(
        String(game?.master_facilitator_id ?? facilitators[0]?.id ?? ''),
    );

    const defaults = typeDefaults[type];
    /* Remounting the fields on a type switch reapplies that type's defaults,
       which is what a new game wants and an existing one does not. */
    const fieldKey = isEditing ? 'game' : type;

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
            title={isEditing ? `Edit ${game.code}` : 'New game'}
            description={
                type === 'SRT'
                    ? 'SRT is the facilitated session: everyone pays and the capacity seats tables of four.'
                    : 'A regular session is free for members and paid by non-members.'
            }
            form={
                isEditing
                    ? GameController.update.form(game.id)
                    : GameController.store.form(event.id)
            }
            submitLabel={isEditing ? 'Save changes' : 'Add game'}
            resetOnSuccess={!isEditing}
        >
            {(errors) => (
                <>
                    <FormField
                        name="code"
                        label="Code"
                        defaultValue={game?.code}
                        error={errors.code}
                        placeholder={type === 'SRT' ? 'SRT #023' : 'Game #246'}
                        required
                        autoFocus
                    />

                    <SelectField
                        name="type"
                        label="Type"
                        value={type}
                        onValueChange={(value) => setType(value as GameType)}
                        options={typeOptions}
                        error={errors.type}
                    />

                    <FormField
                        key={`${fieldKey}-schedule`}
                        name="schedule_at"
                        label="Starts"
                        type="time"
                        defaultValue={game?.schedule_at ?? defaults.scheduleAt}
                        error={errors.schedule_at}
                        required
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            key={`${fieldKey}-member-price`}
                            name="member_price"
                            label="Member price"
                            type="number"
                            min={0}
                            step="0.01"
                            defaultValue={
                                game?.member_price ?? defaults.memberPrice
                            }
                            error={errors.member_price}
                            required
                        />

                        <FormField
                            key={`${fieldKey}-non-member-price`}
                            name="non_member_price"
                            label="Non-member price"
                            type="number"
                            min={0}
                            step="0.01"
                            defaultValue={
                                game?.non_member_price ??
                                defaults.nonMemberPrice
                            }
                            error={errors.non_member_price}
                            required
                        />
                    </div>

                    <FormField
                        key={`${fieldKey}-capacity`}
                        name="capacity"
                        label="Capacity"
                        type="number"
                        min={1}
                        defaultValue={game?.capacity ?? defaults.capacity}
                        error={errors.capacity}
                        required
                    />

                    {/* Regular games run without one, so the field only exists
                        for the facilitated type. */}
                    {type === 'SRT' && (
                        <SelectField
                            name="master_facilitator_id"
                            label="Master facilitator"
                            value={facilitatorId}
                            onValueChange={setFacilitatorId}
                            options={facilitators.map((facilitator) => ({
                                value: String(facilitator.id),
                                label: facilitator.name,
                            }))}
                            error={errors.master_facilitator_id}
                        />
                    )}

                    <SelectField
                        name="status"
                        label="Status"
                        value={status}
                        onValueChange={(value) =>
                            setStatus(value as GameStatus)
                        }
                        options={statusOptions}
                        error={errors.status}
                    />
                </>
            )}
        </FormDialog>
    );
}
