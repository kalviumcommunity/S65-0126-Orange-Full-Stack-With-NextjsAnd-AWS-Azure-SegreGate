'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

/**
 * LayoutWrapper composes Header + Sidebar + main content area.
 * Shows a global loading spinner while auth state is initialising.
 * Sidebar only renders for authenticated users (except on landing page).
 */
export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Don't show sidebar on landing page even if authenticated
  const isLandingPage = pathname === '/';
  const showSidebar = isAuthenticated && !isLandingPage;

  // Global loading state while refreshing auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <div className="flex pt-14">
        {showSidebar && <Sidebar />}

        <main
          className={`min-h-[calc(100vh-3.5rem)] flex-1 transition-all duration-200 ${
            showSidebar ? 'lg:ml-56' : ''
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
