'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  // Protected — AuthContext redirects to /login if not authenticated
  if (!user) return null;

  const quickActions = [
    ...(user.role === 'user' || user.role === 'volunteer' || user.role === 'admin'
      ? [
          {
            label: 'Submit Report',
            href: '/reports/new',
            icon: '📝',
            description: 'Submit a new waste segregation report',
          },
        ]
      : []),
    ...(user.role === 'user' || user.role === 'volunteer' || user.role === 'admin'
      ? [
          {
            label: 'My Reports',
            href: '/reports',
            icon: '📋',
            description: 'View your submitted reports',
          },
        ]
      : []),
    ...(user.role === 'volunteer' || user.role === 'admin'
      ? [
          {
            label: 'Verify Reports',
            href: '/reports/verify',
            icon: '✅',
            description: 'Review and verify pending reports',
          },
        ]
      : []),
    ...(user.role === 'admin'
      ? [
          {
            label: 'Manage Users',
            href: '/users',
            icon: '👥',
            description: 'View and manage all users',
          },
        ]
      : []),
  ];

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Role:{' '}
          <span className="font-medium capitalize">{user.role}</span>
          {' · '}
          {user.email}
        </p>
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-600"
            >
              <span className="text-3xl">{action.icon}</span>
              <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                {action.label}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
