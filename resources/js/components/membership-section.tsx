import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    GraduationCap,
    Infinity as InfinityIcon,
    TrendingUp,
    UsersRound,
} from 'lucide-react';
import { register } from '@/routes';

const benefits = [
    { icon: GraduationCap, lines: ['Exclusive Trainings', '& Workshops'] },
    { icon: UsersRound, lines: ['Networking with', 'Like-minded People'] },
    { icon: TrendingUp, lines: ['Real-world Strategies', '& Mentorship'] },
    { icon: InfinityIcon, lines: ['Lifetime Community', 'Access'] },
];

export default function MembershipSection() {
    return (
        <section
            id="membership"
            className="bg-ink-950 scroll-mt-20 px-5 py-10 sm:px-6 sm:py-20 lg:px-10 lg:py-28"
        >
            <div className="bg-royal-900 shadow-royal relative mx-auto w-full max-w-[90rem] overflow-hidden rounded-2xl sm:rounded-3xl">
                {/* Soft lighting inside the band */}
                <div className="glow-royal absolute inset-x-0 -top-1/3 h-[150%] opacity-70" />

                <div className="relative grid gap-6 p-5 sm:gap-10 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14 lg:p-12">
                    <div>
                        <p className="eyebrow text-gold-400">Membership</p>
                        <h2 className="heading-card mt-3 text-white sm:mt-4">
                            Be part of something bigger
                        </h2>

                        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-10 sm:gap-6 xl:grid-cols-4">
                            {benefits.map((benefit) => (
                                <li
                                    key={benefit.lines.join(' ')}
                                    className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3"
                                >
                                    <span className="border-gold-400/25 bg-royal-800/60 text-gold-400 flex size-8 shrink-0 items-center justify-center rounded-full border sm:size-11">
                                        <benefit.icon className="size-3.5 sm:size-5" />
                                    </span>
                                    <span className="text-[0.6875rem] leading-snug text-white/85 sm:text-sm">
                                        {benefit.lines[0]}
                                        <br />
                                        {benefit.lines[1]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gold text-royal-950 flex flex-col gap-4 rounded-xl p-5 sm:gap-6 sm:rounded-2xl sm:p-8 lg:w-80">
                        <p className="text-sm leading-snug font-bold sm:text-xl">
                            Ready to level up your cashflow game?
                        </p>
                        <Link
                            href={register()}
                            className="bg-royal-800 hover:bg-royal-700 group flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[0.6875rem] font-bold tracking-widest text-white uppercase transition-colors sm:gap-3 sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
                        >
                            Join now
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 sm:size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
