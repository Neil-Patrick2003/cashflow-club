import { ArrowRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Button> & {
    processing?: boolean;
    children: ReactNode;
};

/** The single gold call to action every auth card ends with. */
export default function AuthSubmitButton({
    processing = false,
    children,
    className,
    ...props
}: Props) {
    return (
        <Button
            type="submit"
            disabled={processing}
            className={cn(
                'bg-gold text-royal-950 shadow-gold hover:shadow-gold-lg h-12 w-full rounded-xl text-sm font-bold',
                className,
            )}
            {...props}
        >
            {processing ? <Spinner /> : null}
            {children}
            {processing ? null : <ArrowRight className="size-4" />}
        </Button>
    );
}
