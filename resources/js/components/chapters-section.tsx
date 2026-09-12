import { Form } from '@inertiajs/react';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ChapterController from '@/actions/App/Http/Controllers/Configuration/ChapterController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Chapter } from '@/types';

/* Phone first: fields and icon buttons are 44px for thumbs, tightening to the
   desktop scale from `md` up. */
const fieldClasses = 'h-11 md:h-10';

function StatusBadge({
    isActive,
    className,
}: {
    isActive: boolean;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase',
                isActive
                    ? 'border-gold-400/30 bg-gold-400/10 text-gold-400'
                    : 'border-white/10 bg-white/5 text-white/45',
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    'size-1.5 rounded-full',
                    isActive ? 'bg-gold-400' : 'bg-white/35',
                )}
            />
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
}

/**
 * Create and edit share one dialog: the only differences are the endpoint, the
 * values the fields start on, and the wording.
 */
function ChapterFormDialog({
    chapter,
    showLabel = false,
}: {
    chapter?: Chapter;
    showLabel?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    /* Radix's checkbox submits nothing when unchecked, so the value the server
       validates comes from a hidden input that always has one. */
    const [isActive, setIsActive] = useState(chapter?.is_active ?? true);

    const isEditing = chapter !== undefined;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);

                if (!open) {
                    setIsActive(chapter?.is_active ?? true);
                }
            }}
        >
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button
                        variant="ghost"
                        size={showLabel ? 'sm' : 'icon'}
                        aria-label={`Edit ${chapter.name}`}
                        className={cn(
                            'text-white/60 hover:text-white',
                            !showLabel && 'size-11',
                        )}
                    >
                        <Pencil />
                        {showLabel && 'Edit'}
                    </Button>
                ) : (
                    <Button className={cn('w-full md:w-auto', fieldClasses)}>
                        <Plus />
                        Add chapter
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle className="font-display text-xl font-extrabold tracking-wide uppercase">
                    {isEditing ? 'Edit chapter' : 'New chapter'}
                </DialogTitle>
                <DialogDescription>
                    {isEditing
                        ? 'Rename the chapter, move it to another city, or close it to new members.'
                        : 'Chapters group members and sessions by city.'}
                </DialogDescription>

                <Form
                    {...(isEditing
                        ? ChapterController.update.form(chapter.id)
                        : ChapterController.store.form())}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setIsOpen(false)}
                    resetOnSuccess={!isEditing}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Chapter name</Label>

                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={chapter?.name}
                                    required
                                    autoFocus
                                    placeholder="Metro Manila Chapter"
                                    className={fieldClasses}
                                />

                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>

                                <Input
                                    id="city"
                                    name="city"
                                    defaultValue={chapter?.city}
                                    required
                                    placeholder="Quezon City"
                                    className={fieldClasses}
                                />

                                <InputError message={errors.city} />
                            </div>

                            <div className="border-gold-400/10 flex items-start gap-3 rounded-lg border bg-white/[0.02] p-3">
                                <input
                                    type="hidden"
                                    name="is_active"
                                    value={isActive ? '1' : '0'}
                                />

                                <Checkbox
                                    id="is_active"
                                    checked={isActive}
                                    onCheckedChange={(checked) =>
                                        setIsActive(checked === true)
                                    }
                                    className="mt-0.5"
                                />

                                <div className="grid gap-1 leading-none">
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Inactive chapters stay on record but are
                                        not offered to members.
                                    </p>
                                </div>
                            </div>

                            <InputError message={errors.is_active} />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className={cn(
                                            'w-full md:w-auto',
                                            fieldClasses,
                                        )}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        'w-full md:w-auto',
                                        fieldClasses,
                                    )}
                                >
                                    {isEditing ? 'Save changes' : 'Add chapter'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteChapterDialog({
    chapter,
    showLabel = false,
}: {
    chapter: Chapter;
    showLabel?: boolean;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size={showLabel ? 'sm' : 'icon'}
                    aria-label={`Delete ${chapter.name}`}
                    className={cn(
                        'text-destructive-foreground/80 hover:text-destructive-foreground',
                        !showLabel && 'size-11',
                    )}
                >
                    <Trash2 />
                    {showLabel && 'Delete'}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle className="font-display text-xl font-extrabold tracking-wide uppercase">
                    Delete {chapter.name}?
                </DialogTitle>
                <DialogDescription>
                    The chapter is removed from the system. Close it instead if
                    you only want to stop offering it to members.
                </DialogDescription>

                <Form
                    {...ChapterController.destroy.form(chapter.id)}
                    options={{ preserveScroll: true }}
                >
                    {({ processing }) => (
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="secondary"
                                    type="button"
                                    className={cn(
                                        'w-full md:w-auto',
                                        fieldClasses,
                                    )}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                                className={cn('w-full md:w-auto', fieldClasses)}
                            >
                                Delete chapter
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

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
            <DeleteChapterDialog chapter={chapter} showLabel={showLabels} />
        </div>
    );
}

export default function ChaptersSection({ chapters }: { chapters: Chapter[] }) {
    const activeCount = chapters.filter((chapter) => chapter.is_active).length;

    return (
        <section className="border-gold-400/10 bg-ink-900/40 overflow-hidden rounded-xl border">
            <header className="border-gold-400/10 flex flex-col gap-4 border-b px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
                <div>
                    <h2 className="font-display text-xl font-extrabold tracking-wide text-white uppercase">
                        Chapters
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {chapters.length === 0
                            ? 'The local chapters members can join'
                            : `${chapters.length} chapter${chapters.length === 1 ? '' : 's'}, ${activeCount} active`}
                    </p>
                </div>

                <ChapterFormDialog />
            </header>

            {chapters.length === 0 ? (
                <div className="px-4 py-12 text-center md:py-16">
                    <MapPin
                        aria-hidden="true"
                        className="text-gold-400/60 mx-auto size-6"
                    />
                    <p className="mt-3 font-semibold text-white">
                        No chapters yet
                    </p>
                    <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
                        Add the first city the club runs sessions in.
                    </p>
                </div>
            ) : (
                <>
                    {/* Phones read the chapters as cards; the table below takes
                        over once there is room for four columns. */}
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
                                        <span className="truncate">
                                            {chapter.city}
                                        </span>
                                    </p>
                                    <StatusBadge
                                        isActive={chapter.is_active}
                                        className="mt-2.5"
                                    />
                                </div>

                                <ChapterActions chapter={chapter} />
                            </li>
                        ))}
                    </ul>

                    <div className="hidden md:block">
                        <table className="w-full text-left text-sm">
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
                                    <th
                                        scope="col"
                                        className="px-5 py-3 text-right"
                                    >
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
                                            <StatusBadge
                                                isActive={chapter.is_active}
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <ChapterActions
                                                    chapter={chapter}
                                                    showLabels
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}
