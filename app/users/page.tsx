'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Users, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UsersResponse {
  message: string;
  data: User[];
}

export default function UsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  const { data, error, isLoading, mutate } = useAuthenticatedSWR<UsersResponse>(
    mounted && !authLoading && user?.role === 'admin' ? '/api/users' : null,
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view users.</p>
      </div>
    );
  }

  const users = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <Button variant="secondary" size="sm" onClick={() => mutate()} disabled={isLoading}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load users.
        </div>
      )}

      {isLoading && !data && (
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No users found"
          description="There are no registered users yet."
        />
      )}

      {users.length > 0 && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                  <th className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-3 text-gray-900 dark:text-white">{u.email}</td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        variant={u.role === 'admin' ? 'danger' : u.role === 'volunteer' ? 'info' : 'default'}
                      >
                        {u.role}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/users/${u.id}`}>
                        <Button variant="secondary" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
