'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge, getStatusVariant, getQualityVariant } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { FileText, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Report {
  id: number;
  userId: number;
  location: string;
  description?: string;
  segregationQuality?: string;
  status: string;
  createdAt: string;
}

interface ReportsResponse {
  data: {
    reports: Report[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function ReportsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading } = useAuthenticatedSWR<ReportsResponse>(
    user ? `/api/reports?page=${page}&limit=${limit}` : null,
    { revalidateOnFocus: false },
  );

  if (authLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reports</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const reports = data?.data?.reports ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reports</h1>
        <Link href="/reports/new">
          <Button variant="primary" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load reports. Please try again.
        </div>
      )}

      {/* Loading */}
      {isLoading && !data && (
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reports.length === 0 && (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No reports yet"
          description="Submit your first waste segregation report to get started."
          action={
            <Link href="/reports/new">
              <Button variant="primary" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Submit Report
              </Button>
            </Link>
          }
        />
      )}

      {/* Reports list */}
      {reports.length > 0 && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">#</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Location</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Quality</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                      {report.id}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {report.location || '—'}
                    </td>
                    <td className="px-5 py-3">
                      {report.segregationQuality ? (
                        <StatusBadge variant={getQualityVariant(report.segregationQuality)}>
                          {report.segregationQuality}
                        </StatusBadge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages} &middot; {pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
