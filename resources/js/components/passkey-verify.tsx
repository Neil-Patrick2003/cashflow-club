import type { UrlMethodPair } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRound } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    routes?: {
        options: UrlMethodPair;
        submit: UrlMethodPair;
    };
    label?: string;
    loadingLabel?: string;
    separator?: string;
    /** Whether the divider sits above the button or below it. */
    separatorPlacement?: 'before' | 'after';
};

export default function PasskeyVerify({
    routes,
    label,
    loadingLabel,
    separator,
    separatorPlacement = 'after',
}: Props = {}) {
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        ...(routes && {
            routes: {
                options: routes.options.url,
                submit: routes.submit.url,
            },
        }),
        onSuccess: (response) => {
            router.visit(response.redirect ?? '/dashboard');
        },
    });

    if (!isSupported) {
        return null;
    }

    const divider = (
        <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-xs font-semibold tracking-[0.2em] text-white/45 uppercase">
                {separator ?? 'Or'}
            </span>
            <span className="h-px flex-1 bg-white/15" />
        </div>
    );

    return (
        <div className="grid gap-6">
            {separatorPlacement === 'before' ? divider : null}

            <div className="grid gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-xl border-white/15 bg-white/5 text-sm font-semibold text-white hover:border-white/25 hover:bg-white/10 hover:text-white"
                    onClick={verify}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner /> : <KeyRound className="size-4" />}
                    {isLoading
                        ? (loadingLabel ?? 'Authenticating...')
                        : (label ?? 'Sign in with a passkey')}
                </Button>
                {error && (
                    <InputError message={error} className="text-center" />
                )}
            </div>

            {separatorPlacement === 'after' ? divider : null}
        </div>
    );
}
