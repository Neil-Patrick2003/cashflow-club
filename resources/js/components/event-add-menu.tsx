import { Dices, Plus, Presentation } from 'lucide-react';
import { useState } from 'react';
import GameFormDialog from '@/components/game-form-dialog';
import SeminarFormDialog from '@/components/seminar-form-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Event, Facilitator } from '@/types';

/**
 * The visible way to schedule something inside an event. It sits at the foot
 * of the event's own card, shaped like the cards above it, so adding reads as
 * one more slot in the day rather than something hidden in a menu.
 */
export default function EventAddMenu({
    event,
    facilitators,
}: {
    event: Event;
    facilitators: Facilitator[];
}) {
    const [adding, setAdding] = useState<'game' | 'seminar' | null>(null);

    return (
        <>
            {/* The dialogs sit outside the menu so closing it does not unmount
                them, and the menu is non-modal so the two never argue over the
                page's pointer events on the way through. */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="bg-ink-950/25 text-muted-foreground hover:bg-ink-950/50 flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-semibold transition-colors hover:text-white"
                    >
                        <Plus aria-hidden="true" className="size-4" />
                        Add game or seminar
                    </button>
                </DropdownMenuTrigger>

                {/* As wide as the button that opened it, so the two choices are
                    impossible to miss rather than a small popup off one edge. */}
                <DropdownMenuContent
                    align="start"
                    className="w-(--radix-dropdown-menu-trigger-width)"
                >
                    <DropdownMenuItem
                        className="py-2.5 text-sm"
                        onSelect={() => setAdding('game')}
                    >
                        <Dices />
                        Game
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="py-2.5 text-sm"
                        onSelect={() => setAdding('seminar')}
                    >
                        <Presentation />
                        Seminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <GameFormDialog
                event={event}
                facilitators={facilitators}
                open={adding === 'game'}
                onOpenChange={(open) => !open && setAdding(null)}
            />

            <SeminarFormDialog
                event={event}
                open={adding === 'seminar'}
                onOpenChange={(open) => !open && setAdding(null)}
            />
        </>
    );
}
