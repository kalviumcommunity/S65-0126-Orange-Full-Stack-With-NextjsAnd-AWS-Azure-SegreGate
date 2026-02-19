'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context/AuthContext';

/**
 * Custom hook to access authentication state and actions.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
