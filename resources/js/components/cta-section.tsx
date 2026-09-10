import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { register } from '@/routes';

export default function CtaSection() {
    return (
        /* A compact band: the ink base keeps the joins invisible while the
           transparent-ended gradient supplies the purple. */
        <section
            id="join"
            className="bg-ink-950 relative scroll-mt-20 overflow-hidden px-5 py-16 text-center sm:px-6 sm:py-20 lg:px-10 lg:py-24"
        >
            <div className="bg-band-royal absolute inset-0" />
            <div className="glow-gold absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-50 blur-3xl" />

            <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
                <h2 className="font-display text-gold-shine text-[clamp(1.75rem,4.2vw,3rem)] leading-[0.95] font-extrabold tracking-wide uppercase">
                    Your cashflow journey starts here
                </h2>

                <p className="mt-4 text-sm text-white/80 sm:text-base">
                    Join a community that&rsquo;s serious about financial
                    freedom.
                </p>

                <Link
                    href={register()}
                    className="bg-gold text-royal-950 shadow-gold hover:shadow-gold-lg group mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-xs font-bold tracking-widest uppercase transition-shadow sm:text-sm"
                >
                    Join the club
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
}
