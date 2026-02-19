'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg animate-pulse space-y-4">
        <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  if (!user) return null;

  const fields = [
    { icon: User, label: 'Name', value: user.name },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: user.role, capitalize: true },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

      <Card>
        <div className="p-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-xl font-bold text-green-600 dark:bg-green-900/20 dark:text-green-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.name}
              </p>
              <StatusBadge variant={user.role === 'admin' ? 'danger' : user.role === 'volunteer' ? 'info' : 'default'}>
                {user.role}
              </StatusBadge>
            </div>
          </div>

          {/* Details */}
          <dl className="mt-6 space-y-4">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                  <dt className="w-16 text-sm text-gray-500 dark:text-gray-400">
                    {field.label}
                  </dt>
                  <dd className={`text-sm font-medium text-gray-900 dark:text-white ${field.capitalize ? 'capitalize' : ''}`}>
                    {field.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </Card>
    </div>
  );
}
