import { Users } from 'lucide-react';
import AttendancePill from '@/components/attendance-pill';
import EmptyState from '@/components/empty-state';
import MembershipLevelPill from '@/components/membership-level-pill';
import SeatCheckInButton from '@/components/seat-check-in-button';
import SeatStandingPill from '@/components/seat-standing-pill';
import SectionCard from '@/components/section-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { arrivedCount } from '@/lib/attendance';
import { accessSummary } from '@/lib/payments';
import type { Game, Participant, RosterSeat } from '@/types';

/** Who the row is, marked with their initials the way the door reads a name. */
function ParticipantCell({ participant }: { participant: Participant }) {
    const getInitials = useInitials();

    return (
        <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-royal-900 text-gold-400 text-xs font-bold">
                    {getInitials(participant.name)}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
                <span className="font-display block truncate text-base leading-tight font-extrabold tracking-wide text-white uppercase">
                    {participant.name}
                </span>
                <span className="text-muted-foreground block truncate text-sm font-normal">
                    {participant.email}
                </span>
            </div>
        </div>
    );
}

/** The phone layout: one card per seat, no sideways scrolling. */
function SeatCards({ seats }: { seats: RosterSeat[] }) {
    return (
        <ul className="divide-gold-400/10 divide-y md:hidden">
            {seats.map((seat) => (
                <li key={seat.id} className="flex flex-col gap-3 px-4 py-4">
                    <ParticipantCell participant={seat.user} />

                    <div className="flex flex-wrap items-center gap-2">
                        <MembershipLevelPill participant={seat.user} />
                        <SeatStandingPill seat={seat} />
                        <span className="text-gold-400 text-sm font-bold">
                            {accessSummary(seat)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <AttendancePill seat={seat} />
                        <SeatCheckInButton seat={seat} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

/**
 * The layout from `md` up, once there is room for every column. The roster
 * shares the page with the scanner, so the table is given room to scroll
 * sideways rather than letting its columns run into one another.
 */
function SeatTable({ seats }: { seats: RosterSeat[] }) {
    return (
        <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-3xl text-left text-sm">
                <thead>
                    <tr className="text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                        <th scope="col" className="px-5 py-3">
                            Participant
                        </th>
                        <th scope="col" className="px-5 py-3">
                            Membership
                        </th>
                        <th scope="col" className="px-5 py-3">
                            Access
                        </th>
                        <th scope="col" className="px-5 py-3">
                            Payment
                        </th>
                        <th scope="col" className="px-5 py-3">
                            Attendance
                        </th>
                        <th scope="col" className="w-px px-5 py-3">
                            <span className="sr-only">Check in</span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {seats.map((seat) => (
                        <tr
                            key={seat.id}
                            className="border-gold-400/10 border-t transition-colors hover:bg-white/[0.03]"
                        >
                            <th scope="row" className="px-5 py-4 font-normal">
                                <ParticipantCell participant={seat.user} />
                            </th>
                            <td className="px-5 py-4">
                                <MembershipLevelPill participant={seat.user} />
                            </td>
                            <td className="text-gold-400 px-5 py-4 font-bold whitespace-nowrap">
                                {accessSummary(seat)}
                            </td>
                            <td className="px-5 py-4">
                                <SeatStandingPill seat={seat} />
                            </td>
                            <td className="px-5 py-4">
                                <AttendancePill seat={seat} />
                            </td>
                            <td className="w-px px-5 py-4">
                                <div className="flex justify-end">
                                    <SeatCheckInButton seat={seat} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Who is turning up to one game, in the order they claimed their seats, so the
 * club can call the list at the door and mark them off as they arrive.
 */
export default function GameRosterSection({
    game,
    seats,
}: {
    game: Game;
    seats: RosterSeat[];
}) {
    const arrived = arrivedCount(seats);
    const free = game.capacity - seats.length;

    return (
        <SectionCard
            title="Roster"
            description={
                free > 0
                    ? `${seats.length}/${game.capacity} seats taken · ${free} still free`
                    : `${seats.length}/${game.capacity} seats taken · fully booked`
            }
            action={
                seats.length > 0 && (
                    <p className="text-muted-foreground text-sm whitespace-nowrap">
                        <span className="font-bold text-white">{arrived}</span>{' '}
                        of {seats.length} checked in
                    </p>
                )
            }
        >
            {seats.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No seats taken yet"
                    description="Whoever registers for this game shows up here, in the order they claimed their seat."
                />
            ) : (
                <>
                    <SeatCards seats={seats} />
                    <SeatTable seats={seats} />
                </>
            )}
        </SectionCard>
    );
}
