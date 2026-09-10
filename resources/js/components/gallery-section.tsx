import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import photosData from '@/data/gallery.json';
import { cn } from '@/lib/utils';
import type { GalleryPhoto } from '@/types/gallery';

/** Tilt of the whole photo wall. Raise or lower this one value to taste. */
const TILT = '-18deg';

/**
 * Columns drift in alternating directions at uneven speeds, and the tile
 * heights vary, so the wall never looks like a tidy grid.
 */
const columns = [
    {
        take: [0, 1, 2],
        animation: 'motion-safe:animate-scroll-up',
        duration: '38s',
        heights: ['h-44 lg:h-64', 'h-60 lg:h-84', 'h-36 lg:h-52'],
    },
    {
        take: [3, 4, 5],
        animation: 'motion-safe:animate-scroll-down',
        duration: '29s',
        heights: ['h-60 lg:h-84', 'h-40 lg:h-56', 'h-52 lg:h-72'],
    },
    {
        take: [6, 7, 8],
        animation: 'motion-safe:animate-scroll-up',
        duration: '45s',
        heights: ['h-36 lg:h-52', 'h-56 lg:h-80', 'h-44 lg:h-64'],
    },
    {
        take: [9, 10, 11],
        animation: 'motion-safe:animate-scroll-down',
        duration: '34s',
        heights: ['h-52 lg:h-72', 'h-44 lg:h-64', 'h-60 lg:h-84'],
        /** Extra columns appear only once there is room for them. */
        className: 'hidden sm:block',
    },
    {
        take: [12, 13, 14],
        animation: 'motion-safe:animate-scroll-up',
        duration: '41s',
        heights: ['h-40 lg:h-60', 'h-56 lg:h-80', 'h-48 lg:h-68'],
        className: 'hidden lg:block',
    },
];

function Tile({ photo, height }: { photo: GalleryPhoto; height: string }) {
    return (
        <figure
            className={cn(
                'border-royal-700/50 bg-royal-900 mb-3 w-full shrink-0 overflow-hidden rounded-xl border shadow-xl lg:mb-5',
                height,
            )}
        >
            {photo.image ? (
                <img
                    src={photo.image}
                    alt={photo.alt}
                    className="size-full object-cover"
                />
            ) : (
                /* Empty state — set `image` in gallery.json to replace it. */
                <div className="bg-card flex size-full flex-col items-center justify-center gap-1.5 text-white/20">
                    <ImageIcon className="size-5" />
                    <span className="text-[0.5625rem] font-bold tracking-[0.2em] uppercase">
                        Add photo
                    </span>
                </div>
            )}
        </figure>
    );
}

export default function GallerySection({
    photos = photosData as GalleryPhoto[],
}: {
    photos?: GalleryPhoto[];
}) {
    return (
        <section
            id="gallery"
            className="bg-ink-950 relative flex min-h-[calc(100dvh-5rem)] scroll-mt-20 flex-col justify-center overflow-hidden"
        >
            <div className="mx-auto grid w-full max-w-[90rem] items-center gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12 lg:py-16 lg:pr-0 lg:pl-10">
                <div>
                    <p className="eyebrow text-gold-400">Our community</p>
                    <h2 className="heading-section mt-3 text-white sm:mt-4">
                        Moments that matter
                    </h2>

                    <a
                        href="#contact"
                        className="border-gold-400/50 hover:border-gold-400 hover:bg-gold-400/10 text-gold-400 group mt-6 inline-flex items-center gap-3 rounded-xl border py-3 pr-3 pl-5 text-xs font-bold tracking-widest uppercase transition-colors sm:mt-8 sm:gap-4 sm:py-3.5 sm:pr-3.5 sm:pl-6 sm:text-sm"
                    >
                        See gallery
                        <span className="border-gold-400/50 group-hover:bg-gold-400 group-hover:text-royal-950 flex size-8 items-center justify-center rounded-full border transition-colors sm:size-9">
                            <ArrowRight className="size-4" />
                        </span>
                    </a>
                </div>

                {/* The wall is oversized so its corners stay covered once tilted. */}
                <div className="relative h-[clamp(20rem,46vh,30rem)] overflow-hidden lg:h-[clamp(26rem,74vh,46rem)]">
                    <div
                        style={{ rotate: TILT }}
                        className="absolute top-1/2 left-1/2 flex h-full w-[128%] -translate-x-1/2 -translate-y-1/2 justify-center gap-3 lg:gap-5"
                    >
                        {columns.map((column) => {
                            const tiles = column.take
                                .map((index) => photos[index])
                                .filter(Boolean);

                            return (
                                <div
                                    key={column.take.join('-')}
                                    className={cn(
                                        'min-w-0 flex-1',
                                        column.className,
                                    )}
                                >
                                    <div
                                        style={{
                                            animationDuration: column.duration,
                                        }}
                                        className={cn(
                                            'flex flex-col',
                                            column.animation,
                                        )}
                                    >
                                        {/* Rendered twice so the loop is seamless. */}
                                        {[...tiles, ...tiles].map(
                                            (photo, index) => (
                                                <Tile
                                                    key={`${photo.id}-${index}`}
                                                    photo={photo}
                                                    height={
                                                        column.heights[
                                                            index %
                                                                column.heights
                                                                    .length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Fade the tilted edges into the section. */}
                    <div className="from-ink-950 pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent lg:h-28" />
                    <div className="from-ink-950 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent lg:h-28" />
                    <div className="from-ink-950 pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r to-transparent lg:w-24" />
                </div>
            </div>

            {/* Hands off into the call-to-action band below. */}
            <div className="bg-band-royal-in pointer-events-none absolute inset-x-0 bottom-0 h-40 lg:h-56" />
        </section>
    );
}
