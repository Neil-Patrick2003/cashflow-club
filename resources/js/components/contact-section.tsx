import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Youtube,
} from 'lucide-react';

const channels = [
    {
        icon: Mail,
        label: 'Email us',
        value: 'hello@cashflowclub.ph',
        href: 'mailto:hello@cashflowclub.ph',
    },
    {
        icon: MessageCircle,
        label: 'Message the club',
        value: 'facebook.com/phcashflowclub',
        href: 'https://facebook.com/phcashflowclub',
    },
    {
        icon: MapPin,
        label: 'Start a chapter',
        value: 'Bring the club to your city',
        href: 'mailto:hello@cashflowclub.ph?subject=Starting%20a%20chapter',
    },
];

const socials = [
    {
        icon: Facebook,
        label: 'Facebook',
        href: 'https://facebook.com/phcashflowclub',
    },
    {
        icon: Instagram,
        label: 'Instagram',
        href: 'https://instagram.com/phcashflowclub',
    },
    {
        icon: Youtube,
        label: 'YouTube',
        href: 'https://youtube.com/@phcashflowclub',
    },
];

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="bg-ink-950 relative scroll-mt-20 overflow-hidden px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
        >
            <div className="glow-royal-soft absolute inset-0 opacity-70" />

            <div className="relative mx-auto grid w-full max-w-[90rem] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div>
                    <p className="eyebrow text-gold-400">Contact</p>
                    <h2 className="heading-section mt-3 text-white sm:mt-4">
                        Talk to a<br />
                        <span className="text-gold-shine">real member.</span>
                    </h2>
                    <p className="body-lead mt-4 max-w-md text-white/65 sm:mt-6">
                        Questions about a session, your chapter, or bringing the
                        club to your workplace or parish? A person answers —
                        usually within a day.
                    </p>

                    <div className="mt-7 flex gap-3 sm:mt-9">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={social.label}
                                className="border-royal-800/60 text-gold-400 hover:border-gold-400 hover:bg-gold-400/10 flex size-11 items-center justify-center rounded-full border transition-colors sm:size-12"
                            >
                                <social.icon className="size-5" />
                            </a>
                        ))}
                    </div>
                </div>

                <ul className="flex flex-col gap-3 sm:gap-4">
                    {channels.map((channel) => (
                        <li key={channel.label}>
                            <a
                                href={channel.href}
                                className="border-royal-800/50 bg-royal-950/50 hover:border-gold-400/50 hover:bg-royal-950 group flex items-center gap-4 rounded-2xl border p-5 transition-colors sm:gap-5 sm:p-6"
                            >
                                <span className="border-gold-400/30 bg-gold-400/10 text-gold-400 group-hover:bg-gold-400 group-hover:text-royal-950 flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors sm:size-12">
                                    <channel.icon className="size-5 sm:size-6" />
                                </span>
                                <span className="flex min-w-0 flex-col">
                                    <span className="text-[0.625rem] font-bold tracking-widest text-white/45 uppercase sm:text-xs">
                                        {channel.label}
                                    </span>
                                    <span className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
                                        {channel.value}
                                    </span>
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
