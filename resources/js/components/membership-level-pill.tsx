import { membershipLabel } from '@/lib/attendance';
import { cn } from '@/lib/utils';
import type { Participant } from '@/types';

/**
 * What the club counts this person as. Holding a level is what makes a member,
 * so the level is the badge; a guest is marked as one and left plain, because
 * the door treats them the same either way.
 */
export default function MembershipLevelPill({
    participant,
}: {
    participant: Participant;
}) {
    const isMember = Boolean(participant.membership_level);

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase',
                isMember
                    ? 'bg-royal-700/25 text-white'
                    : 'text-muted-foreground bg-transparent px-0',
            )}
        >
            {membershipLabel(participant)}
        </span>
    );
}
