/** One gallery tile. Mirrors what a server-side `photos` prop should send. */
export type GalleryPhoto = {
    id: number;
    /** Path under /public, or null to show the empty state. */
    image: string | null;
    alt: string;
};
