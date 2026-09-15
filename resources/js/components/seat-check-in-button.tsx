import { Form } from '@inertiajs/react';
import { Undo2, UserCheck } from 'lucide-react';
import AttendanceController from '@/actions/App/Http/Controllers/Events/AttendanceController';
import RowActionButton from '@/components/row-action-button';
import { Button } from '@/components/ui/button';
import { hasArrived } from '@/lib/attendance';
import type { RosterSeat } from '@/types';

/**
 * The door's fallback for a card that will not scan, and the way back out of a
 * check-in recorded against the wrong seat. Neither asks to be confirmed: the
 * queue is moving, and either one is undone by the other.
 *
 * Undoing is a correction rather than the work of the page, so it keeps to an
 * icon and leaves the column narrow enough for the rest of the row.
 */
export default function SeatCheckInButton({ seat }: { seat: RosterSeat }) {
    if (hasArrived(seat)) {
        return (
            <Form
                {...AttendanceController.destroy.form(seat.id)}
                options={{ preserveScroll: true, preserveState: true }}
                className="shrink-0"
            >
                {({ processing }) => (
                    <RowActionButton
                        type="submit"
                        icon={Undo2}
                        label="Undo check-in"
                        disabled={processing}
                    />
                )}
            </Form>
        );
    }

    return (
        <Form
            {...AttendanceController.store.form(seat.id)}
            options={{ preserveScroll: true, preserveState: true }}
            className="shrink-0"
        >
            {({ processing }) => (
                <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={processing}
                    className="h-11 md:h-8"
                >
                    <UserCheck />
                    Check in
                </Button>
            )}
        </Form>
    );
}
