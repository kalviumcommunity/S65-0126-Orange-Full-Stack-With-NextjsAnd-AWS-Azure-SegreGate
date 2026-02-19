/**
 * SWR Fetcher Utility
 * Reusable fetch function for SWR hooks with error handling
 */

interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | unknown;
  token?: string;
}

/**
 * Default fetcher for GET requests
 * Throws on non-ok status codes so SWR treats them as errors
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }

  return res.json();
};

/**
 * Advanced fetcher with support for POST/PUT/DELETE and auth headers
 */
export const advancedFetcher = async (
  url: string,
  options: FetcherOptions = {},
) => {
  const {
    method = 'GET',
    headers = {},
    body,
    token,
  } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }

  return res.json();
};
