import type { GameType } from '@/types';

/**
 * What the schedule is called for this reader. An admin runs the club's games
 * and reads the page as the list of them; everyone else is looking for one to
 * turn up to.
 */
export function scheduleTitle(isAdmin: boolean): string {
    return isAdmin ? 'Games' : 'Find games';
}

/** What kind of session a game is, as the club names it. */
export const gameTypeLabels: Record<GameType, string> = {
    REGULAR: 'Regular game',
    SRT: 'SRT session',
};
