import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { login, register } from '@/routes';

const footerNavigation = [
    {
        heading: 'Explore',
        links: [
            { label: 'Home', href: '#top' },
            { label: 'About', href: '#about' },
            { label: 'Membership', href: '#membership' },
            { label: 'Events', href: '#events' },
        ],
    },
    {
        heading: 'Community',
        links: [
            { label: 'Gallery', href: '#gallery' },
            { label: 'Join the club', href: '#join' },
            { label: 'Contact', href: '#contact' },
            {
                label: 'Start a chapter',
                href: 'mailto:hello@cashflowclub.ph?subject=Starting%20a%20chapter',
            },
        ],
    },
    {
        heading: 'Chapters',
        links: [
            { label: 'Metro Manila', href: '#events' },
            { label: 'Cebu', href: '#events' },
            { label: 'Davao', href: '#events' },
            { label: 'Online table', href: '#events' },
        ],
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

export default function SiteFooter() {
    return (
        <footer className="bg-ink-950 border-royal-800/40 border-t">
            {/* Philippine accent line */}
            <div className="flex h-1">
                <span className="bg-ph-blue flex-1" />
                <span className="bg-ph-red flex-1" />
                <span className="flex-1 bg-white" />
                <span className="bg-gold-400 flex-1" />
            </div>

            <div className="mx-auto w-full max-w-[90rem] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr] lg:gap-16">
                    <div>
                        <span className="flex items-center gap-3">
                            <img
                                src="/cashflow-logo.png"
                                alt="Philippine Cashflow Club"
                                width={52}
                                height={52}
                                className="size-12 shrink-0"
                            />
                            <span className="flex flex-col leading-none">
                                <span className="text-gold-400 text-[0.625rem] font-bold tracking-[0.22em] uppercase">
                                    Philippine
                                </span>
                                <span className="font-display mt-1 text-xl leading-none font-extrabold tracking-wide text-white uppercase">
                                    Cashflow Club
                                </span>
                            </span>
                        </span>

                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
                            A Filipino financial literacy community teaching
                            households to build, grow, and keep wealth — one
                            chapter at a time.
                        </p>

                        <p className="text-gold-400/80 mt-4 text-[0.625rem] font-bold tracking-[0.2em] uppercase sm:text-xs">
                            Est 2025 · Bayanihan · Kapwa · Katiwala
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href={register()}
                                className="bg-gold text-royal-950 rounded-full px-6 py-2.5 text-xs font-bold tracking-widest uppercase sm:text-sm"
                            >
                                Join the Club
                            </Link>
                            <Link
                                href={login()}
                                className="border-royal-800/60 hover:border-gold-400/50 rounded-full border px-6 py-2.5 text-xs font-semibold text-white/80 transition-colors sm:text-sm"
                            >
                                Member log in
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                        {footerNavigation.map((group) => (
                            <div key={group.heading}>
                                <h3 className="text-gold-400 text-[0.625rem] font-bold tracking-widest uppercase sm:text-xs">
                                    {group.heading}
                                </h3>
                                <ul className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="hover:text-gold-400 text-xs text-white/60 transition-colors sm:text-sm"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-royal-800/40 mt-10 flex flex-col gap-4 border-t pt-7 sm:mt-14 sm:pt-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-3">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={social.label}
                                className="border-royal-800/60 text-gold-400 hover:border-gold-400 hover:bg-gold-400/10 flex size-9 items-center justify-center rounded-full border transition-colors"
                            >
                                <social.icon className="size-4" />
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col gap-1.5 text-[0.6875rem] text-white/40 sm:flex-row sm:gap-6 sm:text-xs">
                        <p>
                            © {new Date().getFullYear()} Philippine Cashflow
                            Club. All rights reserved.
                        </p>
                        <p>
                            Financial education only. Not investment, tax, or
                            legal advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
