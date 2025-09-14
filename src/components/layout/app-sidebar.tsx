'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Ticket,
  Users,
  GitMerge,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Icons } from '../icons';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Icons.logo className="size-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              CS-One
            </h2>
            <p className="text-xs text-muted-foreground">Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === '/dashboard'}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/tickets" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith('/tickets')}
                tooltip="Tickets"
              >
                <Ticket />
                <span>Tickets</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/merge" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === '/merge'}
                tooltip="Merge Profiles"
              >
                <GitMerge />
                <span>Merge Profiles</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <Separator className="my-2 bg-border/50" />
         <SidebarMenu>
            <SidebarMenuItem>
              <Link href="#" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-card mt-2">
             <Avatar className="h-10 w-10">
                <AvatarImage src="https://picsum.photos/seed/100/40/40" alt="Admin" data-ai-hint="person face" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@cs-one.com</span>
            </div>
            <LogOut className="ml-auto size-5 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
