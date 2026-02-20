'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge, getStatusVariant, getQualityVariant } from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { 
  ClipboardCheck, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar, 
  User as UserIcon,
  Image as ImageIcon,
  Shield,
  AlertCircle
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'volunteer' && user.role !== 'admin')) {
    return (
      <Card className="py-16 text-center">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Access Restricted
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          You need volunteer or admin access to verify reports.
        </p>
      </Card>
    );
  }

  const pendingReports = data?.data?.reports ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review and approve community submissions
          </p>
        </div>
        {pendingReports.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            {pendingReports.length} pending
          </div>
        )}
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
        <div className="grid gap-4 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && pendingReports.length === 0 && (
        <Card className="py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            All caught up!
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            There are no pending reports to verify right now.
          </p>
        </Card>
      )}

      {/* Reports Grid */}
      {pendingReports.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {pendingReports.map((report) => (
            <Card key={report.id} padding="none" className="overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Photo */}
                {report.photoUrl ? (
                  <a
                    href={report.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      src={report.photoUrl}
                      alt={`Report #${report.id} evidence`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
                      Click to enlarge
                    </div>
                  </a>
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Report #{report.id}
                        </h3>
                        {report.segregationQuality && (
                          <StatusBadge variant={getQualityVariant(report.segregationQuality)} size="sm">
                            {report.segregationQuality}
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                    <StatusBadge variant={getStatusVariant(report.status)}>
                      {report.status}
                    </StatusBadge>
                  </div>

                  {/* Meta */}
                  <div className="mt-3 space-y-2 text-sm">
                    {report.user && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <UserIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{report.user.name} ({report.user.email})</span>
                      </div>
                    )}
                    {report.location && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{new Date(report.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {report.description && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleVerify(report.id, 'approved')}
                      disabled={updatingId === report.id}
                      loading={updatingId === report.id}
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleVerify(report.id, 'rejected')}
                      disabled={updatingId === report.id}
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
