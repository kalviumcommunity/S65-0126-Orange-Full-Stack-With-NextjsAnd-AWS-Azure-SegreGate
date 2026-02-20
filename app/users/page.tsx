'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { 
  Users, 
  RefreshCw, 
  Shield, 
  User as UserIcon, 
  HandHelping,
  Mail,
  Calendar,
  Search,
  UserPlus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UsersResponse {
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export default function UsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data, error, isLoading, mutate } = useAuthenticatedSWR<UsersResponse>(
    mounted && !authLoading && user?.role === 'admin' ? '/api/users' : null,
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view users.</p>
      </Card>
    );
  }

  if (user.role !== 'admin') {
    return (
      <Card className="py-16 text-center">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Admin Access Required
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          You don't have permission to view this page.
        </p>
      </Card>
    );
  }

  const users = data?.data?.users ?? [];
  
  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const volunteerCount = users.filter((u) => u.role === 'volunteer').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'volunteer': return <HandHelping className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string): 'danger' | 'info' | 'default' => {
    switch (role) {
      case 'admin': return 'danger';
      case 'volunteer': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all registered users
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => mutate()} 
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <HandHelping className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{volunteerCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Volunteers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'admin', 'volunteer', 'user'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  roleFilter === role
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Failed to load users. Make sure you have admin access.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && !data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredUsers.length === 0 && (
        <Card className="py-16 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {searchTerm || roleFilter !== 'all' ? 'No matching users' : 'No users found'}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchTerm || roleFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Users will appear here once they register'}
          </p>
        </Card>
      )}

      {/* Users Grid */}
      {filteredUsers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((u) => (
            <Card key={u.id} className="overflow-hidden transition-all hover:shadow-md" padding="none">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' 
                        : u.role === 'volunteer'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {getRoleIcon(u.role)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900 dark:text-white">
                        {u.name || 'No name'}
                      </p>
                      <StatusBadge variant={getRoleBadgeVariant(u.role)} size="sm">
                        {u.role}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
                <Link href={`/users/${u.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
