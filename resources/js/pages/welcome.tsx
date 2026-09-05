import { Head } from '@inertiajs/react';
import Hero from '@/components/hero';
import SiteHeader from '@/components/site-header';

export default function Welcome() {
    return (
        <>
            <Head title="Philippine Cashflow Club" />

            <div id="top" className="bg-ink-950 min-h-screen text-white">
                <SiteHeader />
                <main>
                    <Hero />
                </main>
            </div>
        </>
    );
}
