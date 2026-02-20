'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FilePlus,
  FileText,
  ClipboardCheck,
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  roles?: string[];
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Submit Report',
    href: '/reports/new',
    icon: FilePlus,
    description: 'Create a new segregation report',
    roles: ['user', 'volunteer', 'admin'],
    color: 'bg-blue-500',
  },
  {
    label: 'My Reports',
    href: '/reports',
    icon: FileText,
    description: 'View your submissions',
    roles: ['user', 'volunteer', 'admin'],
    color: 'bg-emerald-500',
  },
  {
    label: 'Verify Reports',
    href: '/reports/verify',
    icon: ClipboardCheck,
    description: 'Review pending reports',
    roles: ['volunteer', 'admin'],
    color: 'bg-amber-500',
  },
  {
    label: 'Manage Users',
    href: '/users',
    icon: Users,
    description: 'User administration',
    roles: ['admin'],
    color: 'bg-purple-500',
  },
];

interface Report {
  id: number;
  status: string;
  segregationQuality: string;
  location?: string;
  createdAt: string;
}

interface ReportsResponse {
  data: {
    reports: Report[];
    pagination: { total: number };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: reportsData, isLoading } = useAuthenticatedSWR<ReportsResponse>(
    user ? '/api/reports?limit=100' : null,
    { revalidateOnFocus: false },
  );

  if (!user) return null;

  const reports = reportsData?.data?.reports ?? [];
  const totalReports = reportsData?.data?.pagination?.total ?? 0;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const approvedCount = reports.filter((r) => r.status === 'approved').length;
  const rejectedCount = reports.filter((r) => r.status === 'rejected').length;

  const visibleActions = QUICK_ACTIONS.filter(
    (a) => !a.roles || a.roles.includes(user.role),
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'volunteer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, {user.name}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {user.role === 'admin' && 'Manage users and oversee all reports'}
            {user.role === 'volunteer' && 'Help verify community submissions'}
            {user.role === 'user' && 'Track your waste segregation reports'}
          </p>
        </div>
        <Link
          href="/reports/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <FilePlus className="h-4 w-4" />
          New Report
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reports</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '—' : totalReports}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <TrendingUp className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                <p className="mt-1 text-3xl font-bold text-amber-600">
                  {isLoading ? '—' : pendingCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</p>
                <p className="mt-1 text-3xl font-bold text-green-600">
                  {isLoading ? '—' : approvedCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected</p>
                <p className="mt-1 text-3xl font-bold text-red-600">
                  {isLoading ? '—' : rejectedCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="group h-full transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
                  <div className="p-5">
                    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-white ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                      {action.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pending Alert for Volunteers/Admins */}
      {(user.role === 'volunteer' || user.role === 'admin') && pendingCount > 0 && (
        <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              {pendingCount} report{pendingCount !== 1 ? 's' : ''} awaiting verification
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Help keep the community accountable by reviewing pending submissions.
            </p>
          </div>
          <Link
            href="/reports/verify"
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Review
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      {reports.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-500"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <Card padding="none">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      report.status === 'approved' 
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20' 
                        : report.status === 'rejected'
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
                    }`}>
                      {report.status === 'approved' && <CheckCircle2 className="h-5 w-5" />}
                      {report.status === 'rejected' && <XCircle className="h-5 w-5" />}
                      {report.status === 'pending' && <Clock className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Report #{report.id}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.location || 'No location'} · {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge 
                    variant={
                      report.status === 'approved' ? 'success' 
                      : report.status === 'rejected' ? 'danger' 
                      : 'warning'
                    }
                  >
                    {report.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Empty state for new users */}
      {!isLoading && reports.length === 0 && (
        <Card className="text-center">
          <div className="py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No reports yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Submit your first waste segregation report to get started.
            </p>
            <Link
              href="/reports/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <FilePlus className="h-4 w-4" />
              Submit First Report
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
