'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { Menu, Moon, Sun, LogOut, Recycle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, toggleSidebar } = useUI();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      {/* Left — hamburger + logo */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-green-600" />
          <span className="text-base font-bold text-gray-900 dark:text-white">
            SegreGate
          </span>
        </Link>
      </div>

      {/* Right — theme toggle, user info, auth */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="hidden items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 sm:flex"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] capitalize text-gray-500 dark:text-gray-400 leading-tight">
                  {user.role}
                </p>
              </div>
            </Link>
            <button
              onClick={logout}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
