import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, Home, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar({ navItems = [] }: { navItems?: NavItem[] }) {
    const page = usePage();

    // Detect lesson show page: /lessons/{id} (id is a number)
    const isLessonShow = /^\/lessons\/\d+/.test(page.url);

    const mainNavItems: NavItem[] = isLessonShow
        ? navItems.length > 0
            ? navItems
            : [
                  {
                      title: 'Back to Courses',
                      href: '/courses',
                      icon: BookOpen,
                  },
              ]
        : [
              {
                  title: 'Dashboard',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Courses',
                  href: '/courses',
                  icon: BookOpen,
              },
              {
                  title: 'Categories',
                  href: '/categories',
                  icon: Folder,
              },
              {
                  title: 'Frontpage',
                  href: '/',
                  icon: Home,
              },
          ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
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
