import { CalendarDays, Check, MapPin, Ticket, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RegistrationController from '@/actions/App/Http/Controllers/RegistrationController';
import FormDialog from '@/components/form-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { formatDate, formatPeso, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ScheduledGame } from '@/types';

/** One line of the game's detail inside the dialog. */
function Fact({
    icon: Icon,
    children,
}: {
    icon: LucideIcon;
    children: string;
}) {
    return (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Icon
                aria-hidden="true"
                className="text-gold-400/70 size-3.5 shrink-0"
            />
            <span className="truncate">{children}</span>
        </div>
    );
}

/**
 * One way in. The server decides which of them applies, so the one that does
 * is shown as chosen and the other is greyed out rather than offered.
 */
function AccessMethodRow({
    title,
    note,
    price,
    applies,
}: {
    title: string;
    note: string;
    price: string;
    applies: boolean;
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-lg p-3',
                applies
                    ? 'bg-gold-400/10 text-white'
                    : 'bg-ink-950/40 text-white/35',
            )}
        >
            <span
                className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full',
                    applies ? 'bg-gold-400 text-ink-950' : 'bg-white/8',
                )}
            >
                {applies && <Check aria-hidden="true" className="size-3" />}
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{title}</p>
                <p
                    className={cn(
                        'text-xs',
                        applies ? 'text-muted-foreground' : 'text-white/30',
                    )}
                >
                    {note}
                </p>
            </div>

            <span
                className={cn(
                    'shrink-0 text-sm font-bold',
                    applies ? 'text-gold-400' : 'text-white/30',
                )}
            >
                {price}
            </span>
        </div>
    );
}

/**
 * Shows what the member is signing up for and how they get in, then claims the
 * seat. Nothing is chosen here: confirming records the way in the server has
 * already worked out, and leaves any money owing as pending.
 */
export default function GameRegisterDialog({ game }: { game: ScheduledGame }) {
    const byMembership = game.entry.access_method === 'MEMBERSHIP';

    return (
        <FormDialog
            trigger={
                <Button>
                    <Ticket />
                    Register
                </Button>
            }
            title={game.code}
            description="Check the details, then confirm your seat."
            form={RegistrationController.store.form(game.id)}
            submitLabel="Confirm registration"
        >
            {(errors) => (
                <>
                    <div className="flex flex-col gap-1.5">
                        {game.event && (
                            <Fact icon={CalendarDays}>
                                {`${formatDate(game.event.date)} · ${formatTime(game.schedule_at)}`}
                            </Fact>
                        )}

                        {game.event?.chapter && (
                            <Fact icon={MapPin}>{game.event.chapter.name}</Fact>
                        )}

                        {game.type === 'SRT' && game.master_facilitator && (
                            <Fact icon={UserRound}>
                                {game.master_facilitator.name}
                            </Fact>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-muted-foreground text-[0.625rem] font-bold tracking-[0.18em] uppercase">
                            How you get in
                        </p>

                        <AccessMethodRow
                            title="Included with membership"
                            note={
                                byMembership
                                    ? 'Your membership covers this game.'
                                    : 'Members only, on games the club runs free.'
                            }
                            price="Free"
                            applies={byMembership}
                        />

                        <AccessMethodRow
                            title="Pay for this game"
                            note={
                                byMembership
                                    ? 'Not needed — your membership covers it.'
                                    : 'Settle it with the club on the day.'
                            }
                            price={formatPeso(
                                byMembership
                                    ? game.non_member_price
                                    : game.entry.price_due,
                            )}
                            applies={!byMembership}
                        />
                    </div>

                    <InputError message={errors.game} />
                </>
            )}
        </FormDialog>
    );
}
