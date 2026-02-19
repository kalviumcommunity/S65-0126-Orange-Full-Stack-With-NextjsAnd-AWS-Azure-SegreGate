'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';

interface NavItem {
  label: string;
  href: string;
  /** If set, only users with one of these roles see this link */
  roles?: string[];
}

/**
 * Sidebar navigation items.
 * `roles` restricts visibility; omit for links visible to all authenticated users.
 */
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  {
    label: 'Submit Report',
    href: '/reports/new',
    roles: ['user', 'volunteer', 'admin'],
  },
  {
    label: 'My Reports',
    href: '/reports',
    roles: ['user', 'volunteer', 'admin'],
  },
  {
    label: 'Verify Reports',
    href: '/reports/verify',
    roles: ['volunteer', 'admin'],
  },
  { label: 'All Users', href: '/users', roles: ['admin'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();
  const pathname = usePathname();

  // Filter nav items based on the current user's role
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-700 dark:bg-gray-900 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
