import type { Chapter } from './chapters';

/**
 * The card a member shows at the door. What the QR carries never leaves the
 * server: the page is sent the rendered code, not the token behind it.
 */
export type MembershipCard = {
    id: number;
    user_id: number;
    /** What the member quotes, as `CFC-P12-2026`. */
    number: string;
    chapter_id: number | null;
    chapter?: Chapter | null;
    created_at: string;
    updated_at: string;
};
