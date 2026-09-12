import { MapPin } from 'lucide-react';
import ChapterDeleteDialog from '@/components/chapter-delete-dialog';
import ChapterFormDialog from '@/components/chapter-form-dialog';
import EmptyState from '@/components/empty-state';
import SectionCard from '@/components/section-card';
import StatusPill from '@/components/status-pill';
import type { Chapter } from '@/types';

function ChapterActions({
    chapter,
    showLabels = false,
}: {
    chapter: Chapter;
    showLabels?: boolean;
}) {
    return (
        <div className="flex shrink-0 items-center gap-1">
            <ChapterFormDialog chapter={chapter} showLabel={showLabels} />
            <ChapterDeleteDialog chapter={chapter} showLabel={showLabels} />
        </div>
    );
}

/** The phone layout: one card per chapter, no sideways scrolling. */
function ChapterCards({ chapters }: { chapters: Chapter[] }) {
    return (
        <ul className="divide-gold-400/10 divide-y md:hidden">
            {chapters.map((chapter) => (
                <li
                    key={chapter.id}
                    className="flex items-start justify-between gap-3 px-4 py-4"
                >
                    <div className="min-w-0">
                        <p className="font-display truncate text-base leading-tight font-extrabold tracking-wide text-white uppercase">
                            {chapter.name}
                        </p>

                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                            <MapPin
                                aria-hidden="true"
                                className="size-3.5 shrink-0"
                            />
                            <span className="truncate">{chapter.city}</span>
                        </p>

                        <StatusPill
                            isActive={chapter.is_active}
                            className="mt-2.5"
                        />
                    </div>

                    <ChapterActions chapter={chapter} />
                </li>
            ))}
        </ul>
    );
}

/** The layout from `md` up, once there is room for four columns. */
function ChapterTable({ chapters }: { chapters: Chapter[] }) {
    return (
        <table className="hidden w-full text-left text-sm md:table">
            <thead>
                <tr className="text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                    <th scope="col" className="px-5 py-3">
                        Chapter
                    </th>
                    <th scope="col" className="px-5 py-3">
                        City
                    </th>
                    <th scope="col" className="px-5 py-3">
                        Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>

            <tbody>
                {chapters.map((chapter) => (
                    <tr
                        key={chapter.id}
                        className="border-gold-400/10 border-t transition-colors hover:bg-white/[0.03]"
                    >
                        <th
                            scope="row"
                            className="font-display px-5 py-4 text-base font-extrabold tracking-wide text-white uppercase"
                        >
                            {chapter.name}
                        </th>
                        <td className="text-muted-foreground px-5 py-4">
                            {chapter.city}
                        </td>
                        <td className="px-5 py-4">
                            <StatusPill isActive={chapter.is_active} />
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex justify-end">
                                <ChapterActions chapter={chapter} showLabels />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function ChaptersSection({ chapters }: { chapters: Chapter[] }) {
    const activeCount = chapters.filter((chapter) => chapter.is_active).length;

    return (
        <SectionCard
            title="Chapters"
            description={
                chapters.length === 0
                    ? 'The local chapters members can join'
                    : `${chapters.length} chapter${chapters.length === 1 ? '' : 's'}, ${activeCount} active`
            }
            action={<ChapterFormDialog />}
        >
            {chapters.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="No chapters yet"
                    description="Add the first city the club runs sessions in."
                />
            ) : (
                <>
                    <ChapterCards chapters={chapters} />
                    <ChapterTable chapters={chapters} />
                </>
            )}
        </SectionCard>
    );
}
