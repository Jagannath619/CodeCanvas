'use client';
import { createContext, useContext } from 'react';
import type { AWSCredentials, CommandHistoryEntry } from '@/types';

export interface AppState {
  isAuthenticated: boolean;
  credentials: string | null; // encrypted
  accountInfo: { account?: string; arn?: string; userId?: string } | null;
  region: string;
  darkMode: boolean;
  readOnlyMode: boolean;
  commandHistory: CommandHistoryEntry[];
  activeSection: string;
}

export interface AppActions {
  setAuthenticated: (creds: string, accountInfo: AppState['accountInfo']) => void;
  logout: () => void;
  setRegion: (region: string) => void;
  toggleDarkMode: () => void;
  toggleReadOnly: () => void;
  addToHistory: (entry: Omit<CommandHistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  setActiveSection: (section: string) => void;
}

export const AppContext = createContext<(AppState & AppActions) | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
