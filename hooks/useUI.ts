'use client';

import { useContext } from 'react';
import { UIContext, UIContextType } from '@/context/UIContext';

/**
 * Custom hook to access UI state (theme, sidebar).
 * Must be used within a UIProvider.
 */
export function useUI(): UIContextType {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
}
