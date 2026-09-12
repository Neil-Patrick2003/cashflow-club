import { Fragment, useState } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * The requirements a new level starts with. The visible controls drive hidden
 * inputs, so the level and its requirements arrive in one request.
 */
export default function LevelRequirementsFieldset({
    error,
}: {
    error?: string;
}) {
    const [needsGames, setNeedsGames] = useState(false);
    const [games, setGames] = useState('10');
    const [needsAssessment, setNeedsAssessment] = useState(false);

    const rows = [
        ...(needsGames ? [{ type: 'ELIGIBLE_GAMES', intValue: games }] : []),
        ...(needsAssessment ? [{ type: 'ASSESSMENT', intValue: null }] : []),
    ];

    return (
        <fieldset className="grid gap-2">
            <legend className="mb-2 text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                Requirements
            </legend>

            {rows.map((row, index) => (
                <Fragment key={row.type}>
                    <input
                        type="hidden"
                        name={`requirements[${index}][type]`}
                        value={row.type}
                    />
                    {row.intValue !== null && (
                        <input
                            type="hidden"
                            name={`requirements[${index}][int_value]`}
                            value={row.intValue}
                        />
                    )}
                </Fragment>
            ))}

            <div className="border-gold-400/10 grid gap-3 rounded-lg border bg-white/[0.02] p-3">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="needs_games"
                        checked={needsGames}
                        onCheckedChange={(checked) =>
                            setNeedsGames(checked === true)
                        }
                    />
                    <Label htmlFor="needs_games">Eligible games</Label>
                </div>

                {needsGames && (
                    <div className="flex items-center gap-3 pl-7">
                        <Input
                            aria-label="Games needed"
                            type="number"
                            min={1}
                            value={games}
                            onChange={(event) => setGames(event.target.value)}
                            className="h-11 w-24 md:h-10"
                            required
                        />
                        <span className="text-muted-foreground text-sm">
                            games needed
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <Checkbox
                        id="needs_assessment"
                        checked={needsAssessment}
                        onCheckedChange={(checked) =>
                            setNeedsAssessment(checked === true)
                        }
                    />
                    <Label htmlFor="needs_assessment">
                        Facilitator assessment
                    </Label>
                </div>
            </div>

            <p className="text-muted-foreground text-sm">
                You can add or change these later from the level's row.
            </p>

            <InputError message={error} />
        </fieldset>
    );
}
