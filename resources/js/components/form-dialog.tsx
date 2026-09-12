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
 */
export default function FormDialog({
    trigger,
    title,
    description,
    form,
    submitLabel,
    submitVariant = 'default',
    resetOnSuccess = false,
    children,
}: {
    trigger: ReactNode;
    title: string;
    description: string;
    form: RouteFormDefinition<'post'>;
    submitLabel: string;
    submitVariant?: 'default' | 'destructive';
    resetOnSuccess?: boolean;
    children?: (errors: Record<string, string>) => ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

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
