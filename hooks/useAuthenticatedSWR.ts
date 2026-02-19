'use client';

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { useAuth } from './useAuth';

/**
 * SWR hook that automatically includes the access token in requests.
 * This solves the issue where regular SWR fetchers don't have access to auth context.
 */
export function useAuthenticatedSWR<T = unknown>(
  key: string | null,
  config?: SWRConfiguration
): SWRResponse<T> {
  const { accessToken } = useAuth();

  const fetcher = async (url: string): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
      headers,
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  };

  return useSWR<T>(key, fetcher, config);
}
