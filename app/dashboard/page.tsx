'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useAuth } from '@/hooks/useAuth';
import { advancedFetcher } from '@/src/lib/fetcher';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FilePlus,
  FileText,
  ClipboardCheck,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  roles?: string[];
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Submit Report',
    href: '/reports/new',
    icon: FilePlus,
    description: 'Submit a new waste segregation report',
    roles: ['user', 'volunteer', 'admin'],
  },
  {
    label: 'My Reports',
    href: '/reports',
    icon: FileText,
    description: 'View your submitted reports',
    roles: ['user', 'volunteer', 'admin'],
  },
  {
    label: 'Verify Reports',
    href: '/reports/verify',
    icon: ClipboardCheck,
    description: 'Review and verify pending reports',
    roles: ['volunteer', 'admin'],
  },
  {
    label: 'Manage Users',
    href: '/users',
    icon: Users,
    description: 'View and manage all users',
    roles: ['admin'],
  },
];

interface ReportsResponse {
  data: {
    reports: { id: number; status: string; segregationQuality: string }[];
    pagination: { total: number };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: reportsData } = useSWR<ReportsResponse>(
    user ? '/api/reports?limit=100' : null,
    advancedFetcher,
    { revalidateOnFocus: false },
  );

  if (!user) return null;

  const reports = reportsData?.data?.reports ?? [];
  const totalReports = reportsData?.data?.pagination?.total ?? 0;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const approvedCount = reports.filter((r) => r.status === 'approved').length;

  const visibleActions = QUICK_ACTIONS.filter(
    (a) => !a.roles || a.roles.includes(user.role),
  );

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="capitalize">{user.role}</span> &middot; {user.email}
        </p>
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalReports}</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
        </Card>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="group h-full transition-colors hover:border-green-300 dark:hover:border-green-700">
                  <div className="flex items-start gap-3 p-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                        {action.label}
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-green-500 dark:text-gray-600" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Reports */}
      {reports.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Reports
            </h2>
            <Link
              href="/reports"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View all
            </Link>
          </div>
          <Card padding="none">
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {reports.slice(0, 5).map((report) => (
                <li
                  key={report.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Report #{report.id}
                  </span>
                  <StatusBadge variant={report.status === 'approved' ? 'success' : report.status === 'rejected' ? 'danger' : 'warning'}>
                    {report.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}
