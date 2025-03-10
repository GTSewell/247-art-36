
import React, { createContext, useContext, useState, useEffect } from 'react';

type AppMode = 'pwa' | 'browser';

interface AppModeContextType {
  mode: AppMode;
  isPWA: boolean;
}

const defaultContext: AppModeContextType = {
  mode: 'browser',
  isPWA: false,
};

const AppModeContext = createContext<AppModeContextType>(defaultContext);

export const useAppMode = () => useContext(AppModeContext);

export const AppModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('browser');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkPWAMode = () => {
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      setMode(isPWA ? 'pwa' : 'browser');
      setIsInitialized(true);
    };

    checkPWAMode();

    const handleDisplayModeChange = (evt: MediaQueryListEvent) => {
      setMode(evt.matches ? 'pwa' : 'browser');
    };

    const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
    displayModeMediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      displayModeMediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Don't render children until we've determined the mode
  if (!isInitialized) {
    return null;
  }

  return (
    <AppModeContext.Provider value={{ mode, isPWA: mode === 'pwa' }}>
      {children}
    </AppModeContext.Provider>
  );
};
