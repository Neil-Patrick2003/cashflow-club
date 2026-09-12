import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

/* Gold marks the current page the way it marks the primary action on the
   landing page: a filled royal pill, a gold label, and a gold edge that reads
   as the active rail even when the sidebar is collapsed to icons. */
const menuButtonClasses =
    'h-10 rounded-lg font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-royal-950 data-[active=true]:text-gold-400 data-[active=true]:shadow-[inset_2px_0_0_var(--color-gold-400)] [&>svg]:size-[18px]';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="mb-1 text-[0.625rem] font-bold tracking-[0.22em] text-white/35 uppercase">
                Club
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentOrParentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className={menuButtonClasses}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
