'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Ticket,
  Users,
  GitMerge,
  Settings,
  LogOut,
  Moon,
  ChevronLeft,
} from 'lucide-react';
import { Icons } from '../icons';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-5" /> },
    { href: '/customers', label: 'Customers', icon: <Users className="size-5" /> },
    { href: '/tickets', label: 'Tickets', icon: <Ticket className="size-5" /> },
    { href: '/merge', label: 'Merge Profiles', icon: <GitMerge className="size-5" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="size-5" /> },
  ];

  return (
    <aside className={cn(
        "flex flex-col gap-y-4 bg-card p-4 shadow-sm transition-all duration-300",
        isCollapsed ? "w-20 items-center" : "w-64"
    )}>
      <div className={cn(
        "flex items-center justify-between",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "gap-0"
        )}>
          <Icons.logo className="size-10 text-primary-foreground bg-primary p-2 rounded-lg" />
          <div className={cn("flex flex-col", isCollapsed && "hidden")}>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              CS-One
            </h2>
            <p className="text-xs text-muted-foreground">Platform</p>
          </div>
        </div>
        <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-7 w-7 text-muted-foreground", isCollapsed && "hidden")}
            onClick={() => setIsCollapsed(true)}
        >
            <ChevronLeft />
        </Button>
      </div>

       {isCollapsed && (
         <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground"
            onClick={() => setIsCollapsed(false)}
        >
            <ChevronLeft className="rotate-180" />
        </Button>
       )}
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}
                className={cn(
                    "w-full justify-start text-base font-normal",
                    isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span className={cn(isCollapsed && "hidden")}>{item.label}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-y-2">
        <Button variant="ghost" className={cn(
            "w-full justify-start text-base font-normal",
            isCollapsed && "justify-center"
        )} title={isCollapsed ? "Logout" : undefined}>
          <LogOut className="size-5" />
          <span className={cn(isCollapsed && "hidden")}>Logout</span>
        </Button>
        <div className={cn(
            "flex items-center justify-between p-2 rounded-md hover:bg-accent",
            isCollapsed && "justify-center"
        )}>
            <div className={cn(
                "flex items-center gap-2",
                isCollapsed && "hidden"
            )}>
                <Moon className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Dark Mode</span>
            </div>
            <Switch />
        </div>
      </div>
    </aside>
  );
}
