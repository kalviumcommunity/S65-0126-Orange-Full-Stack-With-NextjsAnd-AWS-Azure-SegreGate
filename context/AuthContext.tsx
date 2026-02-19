'use client';

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

/** Shape of the authenticated user object */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/** AuthContext value type */
export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Pages that require authentication — redirects to /login if not authed */
const PROTECTED_PAGES = ['/dashboard', '/users', '/reports', '/profile'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /* ── Token refresh (uses HTTP-only cookie) ─────────────────────── */
  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success && data.data) {
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Attempt silent refresh on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Client-side route guard — redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      const isProtected = PROTECTED_PAGES.some((route) =>
        pathname.startsWith(route),
      );
      if (isProtected) {
        router.replace('/login');
      }
    }
  }, [isLoading, user, pathname, router]);

  /* ── Login ─────────────────────────────────────────────────────── */
  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    router.push('/dashboard');
  };

  /* ── Signup ────────────────────────────────────────────────────── */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'Signup failed');
    }

    // After successful signup, redirect to login
    router.push('/login');
  };

  /* ── Logout ────────────────────────────────────────────────────── */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    // Expire the refresh-token cookie client-side
    document.cookie =
      'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
