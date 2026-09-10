import { Head } from '@inertiajs/react';
import AboutSection from '@/components/about-section';
import ContactSection from '@/components/contact-section';
import CtaSection from '@/components/cta-section';
import EventsSection from '@/components/events-section';
import GallerySection from '@/components/gallery-section';
import Hero from '@/components/hero';
import MembershipSection from '@/components/membership-section';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function Welcome() {
    return (
        <>
            <Head title="Philippine Cashflow Club" />

            <div id="top" className="bg-ink-950 min-h-screen text-white">
                <SiteHeader />
                <main>
                    <Hero />
                    <AboutSection />
                    <MembershipSection />
                    <EventsSection />
                    <GallerySection />
                    <CtaSection />
                    <ContactSection />
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
