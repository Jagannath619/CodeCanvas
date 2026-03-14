'use client';
import { useState, useCallback, type ReactNode } from 'react';
import { AppContext, type AppState } from '@/lib/store';
import type { CommandHistoryEntry } from '@/types';

export default function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    credentials: null,
    accountInfo: null,
    region: 'us-east-1',
    darkMode: true,
    readOnlyMode: true,
    commandHistory: [],
    activeSection: 'compute',
  });

  const setAuthenticated = useCallback((creds: string, accountInfo: AppState['accountInfo']) => {
    setState(s => ({ ...s, isAuthenticated: true, credentials: creds, accountInfo }));
  }, []);

  const logout = useCallback(() => {
    setState(s => ({ ...s, isAuthenticated: false, credentials: null, accountInfo: null }));
  }, []);

  const setRegion = useCallback((region: string) => {
    setState(s => ({ ...s, region }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(s => ({ ...s, darkMode: !s.darkMode }));
  }, []);

  const toggleReadOnly = useCallback(() => {
    setState(s => ({ ...s, readOnlyMode: !s.readOnlyMode }));
  }, []);

  const addToHistory = useCallback((entry: Omit<CommandHistoryEntry, 'id' | 'timestamp'>) => {
    setState(s => ({
      ...s,
      commandHistory: [
        { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
        ...s.commandHistory,
      ].slice(0, 100),
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(s => ({ ...s, commandHistory: [] }));
  }, []);

  const setActiveSection = useCallback((activeSection: string) => {
    setState(s => ({ ...s, activeSection }));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setAuthenticated, logout, setRegion, toggleDarkMode, toggleReadOnly, addToHistory, clearHistory, setActiveSection }}>
      {children}
    </AppContext.Provider>
  );
}
