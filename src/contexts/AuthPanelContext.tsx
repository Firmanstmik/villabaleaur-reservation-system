import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AuthPanelContextType {
  isAuthPanelOpen: boolean;
  openAuthPanel: (mode?: 'login' | 'signup') => void;
  closeAuthPanel: () => void;
  toggleAuthPanel: (mode?: 'login' | 'signup') => void;
  initialMode: 'login' | 'signup';
}

const AuthPanelContext = createContext<AuthPanelContextType | undefined>(undefined);

/**
 * Provider component for managing global auth panel state
 * Allows any component to trigger the auth panel from Navbar
 */
export function AuthPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'login' | 'signup'>('login');

  const openAuthPanel = useCallback((mode: 'login' | 'signup' = 'login') => {
    setInitialMode(mode);
    setIsOpen(true);
  }, []);

  const closeAuthPanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAuthPanel = useCallback((mode: 'login' | 'signup' = 'login') => {
    setInitialMode(mode);
    setIsOpen((prev) => !prev);
  }, []);

  const value: AuthPanelContextType = {
    isAuthPanelOpen: isOpen,
    openAuthPanel,
    closeAuthPanel,
    toggleAuthPanel,
    initialMode,
  };

  return <AuthPanelContext.Provider value={value}>{children}</AuthPanelContext.Provider>;
}

/**
 * Hook to access auth panel context
 * Must be used within AuthPanelProvider
 */
export function useAuthPanel() {
  const context = useContext(AuthPanelContext);

  if (!context) {
    throw new Error('useAuthPanel must be used within AuthPanelProvider');
  }

  return context;
}
