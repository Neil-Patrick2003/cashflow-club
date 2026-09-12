import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Globe,
    LayoutGrid,
    Settings,
    SlidersHorizontal,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import { index as configuration } from '@/routes/configuration';
import { index as settings } from '@/routes/settings';
import type { NavItem } from '@/types';

const dashboardNavItem: NavItem = {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
};

/* Guarded by the `administer` gate server-side; hiding it here only keeps the
   rail honest about what this member can reach. */
const configurationNavItem: NavItem = {
    title: 'Configuration',
    href: configuration(),
    icon: SlidersHorizontal,
};

const settingsNavItem: NavItem = {
    title: 'Settings',
    href: settings(),
    icon: Settings,
};

const footerNavItems: NavItem[] = [
    {
        title: 'Club website',
        href: home(),
        icon: Globe,
    },
    {
        title: 'Facebook',
        href: 'https://facebook.com/phcashflowclub',
        icon: Facebook,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        dashboardNavItem,
        ...(auth.user?.is_admin ? [configurationNavItem] : []),
        settingsNavItem,
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-gold-400/10 mb-2 border-b pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-white/5 active:bg-white/5"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
