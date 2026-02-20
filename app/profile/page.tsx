'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { User, Mail, Shield, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'volunteer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account information</p>
      </div>

      {/* Profile Card */}
      <Card padding="none" className="overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-green-500 to-emerald-600" />
        
        {/* Avatar & Info */}
        <div className="px-6 pb-6 pt-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="-mt-16 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-green-400 to-emerald-600 text-3xl font-bold text-white shadow-lg dark:border-gray-900">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Name & Role */}
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="truncate text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="truncate font-medium text-gray-900 dark:text-white" title={user.email}>{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Account Type</p>
                <p className="font-medium capitalize text-gray-900 dark:text-white">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium text-gray-900 dark:text-white">Recently joined</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/reports" className="group">
          <Card className="transition-all hover:border-green-200 hover:shadow-md dark:hover:border-green-800">
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/30">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">My Reports</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View your submissions</p>
              </div>
            </div>
          </Card>
        </Link>

        {(user.role === 'volunteer' || user.role === 'admin') && (
          <Link href="/reports/verify" className="group">
            <Card className="transition-all hover:border-blue-200 hover:shadow-md dark:hover:border-blue-800">
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Verify Reports</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Review pending submissions</p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
