
import React, { createContext, useContext, useState, useEffect } from 'react';

type AppMode = 'pwa' | 'browser';

interface AppModeContextType {
  mode: AppMode;
  isPWA: boolean;
}

const AppModeContext = createContext<AppModeContextType>({
  mode: 'browser',
  isPWA: false,
});

export const useAppMode = () => useContext(AppModeContext);

export const AppModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('browser');

  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    setMode(isPWA ? 'pwa' : 'browser');

    const handleDisplayModeChange = (evt: MediaQueryListEvent) => {
      setMode(evt.matches ? 'pwa' : 'browser');
    };

    const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
    displayModeMediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      displayModeMediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  return (
    <AppModeContext.Provider value={{ mode, isPWA: mode === 'pwa' }}>
      {children}
    </AppModeContext.Provider>
  );
};
