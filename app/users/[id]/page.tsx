'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Mail, Shield, Calendar } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id || !accessToken) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          setError(data.message || 'User not found');
        }
      } catch {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, accessToken]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <Link href="/users">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const details = [
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Shield, label: 'Role', value: profile.role, badge: true },
    { icon: Calendar, label: 'Joined', value: new Date(profile.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-xl font-bold text-green-600 dark:bg-green-900/20 dark:text-green-400">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-4">
            {details.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                  <dt className="w-16 text-sm text-gray-500 dark:text-gray-400">{d.label}</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {d.badge ? (
                      <StatusBadge variant={profile.role === 'admin' ? 'danger' : profile.role === 'volunteer' ? 'info' : 'default'}>
                        {d.value}
                      </StatusBadge>
                    ) : (
                      d.value
                    )}
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
