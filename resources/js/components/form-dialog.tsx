import { Form } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { RouteFormDefinition } from '@/wayfinder';

/* Phone first: dialog buttons are full width and 44px tall for thumbs, and
   settle onto one auto-width row from `md` up. */
export const dialogButtonClasses = 'h-11 w-full md:h-10 md:w-auto';

/**
 * A dialog wrapped around one Wayfinder form action. Pass fields through
 * `children` to edit something, or leave it out for a plain confirmation.
 * Radix unmounts the content on close, so the fields always reopen clean.
 *
 * It opens from its own `trigger` by default. Pass `open` and `onOpenChange`
 * instead to drive it from somewhere else, such as a menu item that cannot
 * host a trigger of its own.
 */
export default function FormDialog({
    trigger,
    open,
    onOpenChange,
    title,
    description,
    form,
    submitLabel,
    submitVariant = 'default',
    resetOnSuccess = false,
    children,
}: {
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description: string;
    form: RouteFormDefinition<'post'>;
    submitLabel: string;
    submitVariant?: 'default' | 'destructive';
    resetOnSuccess?: boolean;
    children?: (errors: Record<string, string>) => ReactNode;
}) {
    const [isOwnOpen, setIsOwnOpen] = useState(false);
    const isOpen = open ?? isOwnOpen;

    function setIsOpen(next: boolean): void {
        setIsOwnOpen(next);
        onOpenChange?.(next);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent>
                <DialogTitle className="font-display text-xl font-extrabold tracking-wide uppercase">
                    {title}
                </DialogTitle>
                <DialogDescription>{description}</DialogDescription>

                <Form
                    {...form}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setIsOpen(false)}
                    resetOnSuccess={resetOnSuccess}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            {children?.(errors)}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className={dialogButtonClasses}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    variant={submitVariant}
                                    disabled={processing}
                                    className={dialogButtonClasses}
                                >
                                    {submitLabel}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
