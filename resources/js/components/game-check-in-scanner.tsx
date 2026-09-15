import { router, usePage } from '@inertiajs/react';
import { Camera, CameraOff, QrCode, RotateCcw } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useCallback, useEffect, useRef, useState } from 'react';
import CheckInController from '@/actions/App/Http/Controllers/Events/CheckInController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Game } from '@/types';

/**
 * How long the same card is ignored for after it has been read. A card held up
 * to the lens is decoded many times a second, and all of those readings are
 * the one arrival.
 */
const REPEAT_SCAN_MS = 4000;

/** Where the camera has got to, which is what the frame reports underneath. */
type CameraStatus = 'idle' | 'starting' | 'scanning' | 'blocked';

const statusNotes: Record<CameraStatus, string> = {
    idle: 'Camera off. Start it to scan members in.',
    starting: 'Waiting for the camera…',
    scanning: 'Camera ready · hold the member QR steady',
    blocked:
        'The camera would not open. Check members in from the roster instead.',
};

/**
 * Why the camera would not open, said as the thing the door has to go and do
 * about it. Every one of these arrives as the same dead frame otherwise, and
 * a refused permission is nothing like a browser that was never allowed to
 * ask.
 */
/**
 * What the browser actually threw, kept for the line under the reason. The
 * advice above it is a guess at which of several causes applies; this is not,
 * and it is the difference between fixing the right thing and trying all of
 * them.
 */
function blockedDetail(error: unknown): string {
    if (error instanceof Error) {
        return error.name ? `${error.name}: ${error.message}` : error.message;
    }

    return typeof error === 'string' ? error : 'Unknown camera error';
}

function blockedReason(error: unknown): string {
    /* Browsers hand out no camera at all over plain HTTP, so there was never
       a permission to refuse: nothing was asked. */
    if (!window.isSecureContext) {
        return 'The camera needs a secure page. Open this over https:// or on localhost.';
    }

    switch (error instanceof Error ? error.name : '') {
        case 'NotAllowedError':
        case 'SecurityError':
            return 'Camera access is blocked. Allow it from the padlock in the address bar — and on Windows, in Settings · Privacy · Camera — then try again.';
        case 'NotFoundError':
        case 'OverconstrainedError':
            return 'No camera on this device. Check members in from the roster instead.';
        case 'NotReadableError':
        case 'AbortError':
            return 'Another app is holding the camera. Close it, then try again.';
        default:
            return 'The camera would not open. Check members in from the roster instead.';
    }
}

/**
 * The door station for this game: point it at a member's card and their seat
 * is marked as arrived. The card carries a token and nothing else, so what
 * comes off the lens is sent up as-is and the club's own record decides whose
 * it is.
 *
 * The game is the page it sits on, so there is nothing to pick here: the
 * camera opens on arrival and everything it reads is checked in against this
 * game.
 */
export default function GameCheckInScanner({ game }: { game: Game }) {
    const { errors } = usePage().props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastScan = useRef({ token: '', at: 0 });
    /* Whatever the last camera still has to finish letting go of. */
    const teardown = useRef<Promise<void>>(Promise.resolve());
    /* The door opened this page to work it, so the camera starts itself. */
    const [isOn, setIsOn] = useState(true);
    const [attempt, setAttempt] = useState(0);
    const [status, setStatus] = useState<CameraStatus>('idle');
    const [blocked, setBlocked] = useState<{
        reason: string;
        detail: string;
    } | null>(null);

    const submitScan = useCallback(
        (token: string): void => {
            const now = Date.now();

            if (
                token === lastScan.current.token &&
                now - lastScan.current.at < REPEAT_SCAN_MS
            ) {
                return;
            }

            lastScan.current = { token, at: now };

            /* The page is left exactly where the door had it, so the camera
               keeps running while the roster behind it is re-read. */
            router.post(
                CheckInController.store.url(game.id),
                { token },
                { preserveScroll: true, preserveState: true },
            );
        },
        [game.id],
    );

    useEffect(() => {
        const video = videoRef.current;

        if (!isOn || !video) {
            setStatus('idle');

            return;
        }

        setStatus('starting');

        /* The camera may still be opening when the door walks away from the
           page, so a resolved start is only acted on while it still matters. */
        let isLive = true;
        let scanner: QrScanner | null = null;

        /* Opening a camera is slow and tearing one down mid-open leaves the
           stream held, so every attempt queues behind the last one's teardown
           rather than racing it for the lens. Strict mode runs this effect
           twice on mount, which is exactly that race. */
        const opening = teardown.current.then(async () => {
            if (!isLive) {
                return;
            }

            scanner = new QrScanner(video, ({ data }) => submitScan(data), {
                preferredCamera: 'environment',
                highlightScanRegion: true,
                highlightCodeOutline: true,
                maxScansPerSecond: 4,
                returnDetailedScanResult: true,
            });

            try {
                await scanner.start();

                if (isLive) {
                    setBlocked(null);
                    setStatus('scanning');
                }
            } catch (error: unknown) {
                if (isLive) {
                    setBlocked({
                        reason: blockedReason(error),
                        detail: blockedDetail(error),
                    });
                    setStatus('blocked');
                }
            }
        });

        return () => {
            isLive = false;
            teardown.current = opening.then(() => scanner?.destroy());
        };
    }, [isOn, attempt, submitScan]);

    /* A camera that would not open is worth another go on the spot, because
       what refused it — a permission prompt, a lens another tab had — is
       usually gone by the time the door notices. */
    const isBlocked = status === 'blocked';

    return (
        <section className="border-gold-400/10 bg-ink-900/40 flex flex-col gap-4 rounded-xl border p-4 md:p-5">
            <div>
                <h2 className="font-display text-xl font-extrabold tracking-wide text-white uppercase">
                    QR check-in
                </h2>

                <p className="text-muted-foreground mt-1 text-sm">
                    Scanning for {game.code}.
                </p>
            </div>

            {/* The frame keeps its shape whether or not the camera is on, so
                starting it never shifts the page under the door's thumb. */}
            <div className="bg-ink-950/60 relative aspect-square w-full overflow-hidden rounded-xl border border-white/8">
                {/* The scanner draws its own highlight in beside the video, so
                    the video is given a wrapper of its own to be drawn into and
                    React is left nothing of its own to lose track of.

                    The video is never hidden while it runs: a browser does not
                    decode frames into an element it has been told not to
                    render, and does not reliably pick it up again once it is
                    shown. What covers it is laid over the top instead. */}
                <div className="absolute inset-0">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="size-full object-cover"
                    />
                </div>

                {status !== 'scanning' && (
                    <div className="bg-ink-950 absolute inset-0 grid place-items-center">
                        <QrCode
                            aria-hidden="true"
                            className="text-royal-700 size-20"
                        />
                    </div>
                )}
            </div>

            <div aria-live="polite" className="text-center">
                <p
                    className={cn(
                        'text-sm',
                        isBlocked ? 'text-gold-400' : 'text-muted-foreground',
                    )}
                >
                    {blocked?.reason ?? statusNotes[status]}
                </p>

                {blocked && (
                    <p className="mt-1 font-mono text-xs break-words text-white/35">
                        {blocked.detail}
                    </p>
                )}
            </div>

            <InputError message={errors.token} />

            <Button
                type="button"
                variant="outline"
                onClick={() =>
                    isBlocked
                        ? setAttempt((tries) => tries + 1)
                        : setIsOn((on) => !on)
                }
                className="h-11 w-full"
            >
                {isBlocked ? <RotateCcw /> : isOn ? <CameraOff /> : <Camera />}
                {isBlocked
                    ? 'Try the camera again'
                    : isOn
                      ? 'Stop camera'
                      : 'Start camera'}
            </Button>

            <p className="text-muted-foreground text-sm">
                Attendance is recorded separately from registration and payment.
                A no-show keeps its paid registration.
            </p>
        </section>
    );
}
