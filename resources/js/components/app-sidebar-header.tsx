import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    /* Sticky blurred ink, the same treatment as the landing page header.
       `md:top-2` parks it on the inset panel's edge rather than the viewport's,
       so the panel's rounded corner stays visible. */
    return (
        <header className="border-gold-400/10 bg-ink-950/80 sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 rounded-t-xl border-b px-6 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:top-2 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
