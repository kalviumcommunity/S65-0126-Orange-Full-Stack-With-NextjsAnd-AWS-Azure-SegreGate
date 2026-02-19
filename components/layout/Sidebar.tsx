'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  ClipboardCheck,
  Users,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Submit Report', href: '/reports/new', icon: FilePlus, roles: ['user', 'volunteer', 'admin'] },
  { label: 'My Reports', href: '/reports', icon: FileText, roles: ['user', 'volunteer', 'admin'] },
  { label: 'Verify Reports', href: '/reports/verify', icon: ClipboardCheck, roles: ['volunteer', 'admin'] },
  { label: 'Users', href: '/users', icon: Users, roles: ['admin', 'volunteer'] },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const { user } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-56 border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="flex flex-col gap-0.5 p-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && item.href !== '/profile' && item.href !== '/reports'
                && pathname.startsWith(item.href + '/'));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
