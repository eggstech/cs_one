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
  ChevronRight,
  Search,
  Moon,
} from 'lucide-react';
import { Icons } from '../icons';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-5" /> },
    { href: '/customers', label: 'Customers', icon: <Users className="size-5" /> },
    { href: '/tickets', label: 'Tickets', icon: <Ticket className="size-5" /> },
    { href: '/merge', label: 'Merge Profiles', icon: <GitMerge className="size-5" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="size-5" /> },
  ];

  return (
    <aside className="w-64 flex flex-col gap-y-4 bg-card p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icons.logo className="size-10 text-primary-foreground bg-primary p-2 rounded-lg" />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              CS-One
            </h2>
            <p className="text-xs text-muted-foreground">Platform</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
            <ChevronRight />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9 bg-input border-0 focus-visible:ring-primary" />
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}
                className="w-full justify-start text-base font-normal"
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-y-2">
        <Button variant="ghost" className="w-full justify-start text-base font-normal">
          <LogOut className="size-5" />
          <span>Logout</span>
        </Button>
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
            <div className="flex items-center gap-2">
                <Moon className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Dark Mode</span>
            </div>
            <Switch />
        </div>
      </div>
    </aside>
  );
}
