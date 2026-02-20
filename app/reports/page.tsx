'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge, getStatusVariant, getQualityVariant } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { 
  FileText, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';

interface Report {
  id: number;
  userId: number;
  location: string;
  description?: string;
  segregationQuality?: string;
  status: string;
  photoUrl?: string;
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const reports = data?.data?.reports ?? [];
  const pagination = data?.data?.pagination;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {pagination?.total ?? 0} total report{(pagination?.total ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/reports/new">
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Failed to load reports. Please try again.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && !data && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reports.length === 0 && (
        <Card className="py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No reports yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Submit your first waste segregation report to get started.
          </p>
          <Link href="/reports/new" className="mt-6 inline-block">
            <Button variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Submit Your First Report
            </Button>
          </Link>
        </Card>
      )}

      {/* Reports Grid */}
      {reports.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Card 
              key={report.id} 
              className="group overflow-hidden transition-all hover:shadow-md"
              padding="none"
            >
              <div className="flex h-full">
                {/* Thumbnail */}
                {report.photoUrl ? (
                  <div className="relative w-28 shrink-0 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={report.photoUrl}
                      alt={`Report #${report.id}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex w-28 shrink-0 items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Report #{report.id}
                      </h3>
                      <StatusBadge variant={getStatusVariant(report.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </StatusBadge>
                    </div>
                    
                    {report.location && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    
                    {report.segregationQuality && (
                      <StatusBadge variant={getQualityVariant(report.segregationQuality)} size="sm">
                        {report.segregationQuality}
                      </StatusBadge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page <span className="font-medium">{pagination.page}</span> of{' '}
            <span className="font-medium">{pagination.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
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
