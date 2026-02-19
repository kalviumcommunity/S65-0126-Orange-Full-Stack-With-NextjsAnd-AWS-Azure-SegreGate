'use client';

import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface StatusBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function StatusBadge({ children, variant = 'default', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Map report status to badge variant */
export function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
}

/** Map segregation quality to badge variant */
export function getQualityVariant(quality: string): BadgeVariant {
  switch (quality) {
    case 'excellent':
      return 'success';
    case 'good':
      return 'info';
    case 'fair':
      return 'warning';
    case 'poor':
      return 'danger';
    default:
      return 'default';
  }
}
