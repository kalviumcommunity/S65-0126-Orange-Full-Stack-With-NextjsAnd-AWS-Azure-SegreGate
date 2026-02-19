'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge, getStatusVariant, getQualityVariant } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';

interface Report {
  id: number;
  userId: number;
  location: string;
  description?: string;
  segregationQuality?: string;
  status: string;
  photoUrl?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ReportsResponse {
  data: {
    reports: Report[];
    pagination: { total: number; page: number; totalPages: number };
  };
}

export default function VerifyReportsPage() {
  const { user, isLoading: authLoading, accessToken } = useAuth();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR<ReportsResponse>(
    user && (user.role === 'volunteer' || user.role === 'admin')
      ? '/api/reports?status=pending&limit=50'
      : null,
    { revalidateOnFocus: false },
  );

  const handleVerify = async (reportId: number, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update report');
      }

      toast.success(`Report #${reportId} ${newStatus}`);
      mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Reports</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'volunteer' && user.role !== 'admin')) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          You need volunteer or admin access to verify reports.
        </p>
      </div>
    );
  }

  const allReports = data?.data?.reports ?? [];
  // Reports are already filtered by status=pending on the server side
  const pendingReports = allReports;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Reports</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {pendingReports.length} pending report{pendingReports.length !== 1 ? 's' : ''} to review
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load reports.
        </div>
      )}

      {isLoading && !data && (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {!isLoading && pendingReports.length === 0 && (
        <EmptyState
          icon={<ClipboardCheck className="h-10 w-10" />}
          title="All caught up"
          description="There are no pending reports to verify right now."
        />
      )}

      <div className="space-y-3">
        {pendingReports.map((report) => (
          <Card key={report.id}>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Report #{report.id}
                    </span>
                    <StatusBadge variant={getStatusVariant(report.status)}>
                      {report.status}
                    </StatusBadge>
                    {report.segregationQuality && (
                      <StatusBadge variant={getQualityVariant(report.segregationQuality)}>
                        {report.segregationQuality}
                      </StatusBadge>
                    )}
                  </div>
                  {report.user && (
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Submitted by: {report.user.name} ({report.user.email})
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.location || 'No location'} &middot;{' '}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  {report.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {report.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleVerify(report.id, 'approved')}
                    disabled={updatingId === report.id}
                    loading={updatingId === report.id}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleVerify(report.id, 'rejected')}
                    disabled={updatingId === report.id}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>

              {/* Photo evidence */}
              {report.photoUrl && (
                <div className="mt-2">
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Photo Evidence:
                  </p>
                  <a
                    href={report.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={report.photoUrl}
                      alt={`Report #${report.id} evidence`}
                      className="h-48 w-auto rounded-lg border border-gray-200 object-cover transition-transform hover:scale-105 dark:border-gray-700"
                    />
                  </a>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
