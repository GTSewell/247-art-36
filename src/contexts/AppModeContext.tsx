
import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { isLovablePreview } from '../utils/environmentDetector';

type AppMode = 'pwa' | 'browser' | 'preview';

interface AppModeContextType {
  mode: AppMode;
  isPWA: boolean;
  isPreview: boolean;
}

const AppModeContext = createContext<AppModeContextType>({
  mode: 'browser',
  isPWA: false,
  isPreview: false,
});

export const useAppMode = () => useContext(AppModeContext);

export const AppModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('browser');

  useEffect(() => {
    try {
      // Check if we're in Lovable preview environment
      if (isLovablePreview()) {
        logger.info('Running in Lovable preview environment');
        setMode('preview');
        return;
      }

      // Standard PWA detection
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      setMode(isPWA ? 'pwa' : 'browser');
      logger.info(`Initial app mode set to: ${isPWA ? 'pwa' : 'browser'}`);

      const handleDisplayModeChange = (evt: MediaQueryListEvent) => {
        const newMode = evt.matches ? 'pwa' : 'browser';
        logger.info(`Display mode changed to: ${newMode}`);
        setMode(newMode);
      };

      const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
      displayModeMediaQuery.addEventListener('change', handleDisplayModeChange);

      return () => {
        displayModeMediaQuery.removeEventListener('change', handleDisplayModeChange);
      };
    } catch (error) {
      logger.error('Error in AppModeProvider:', error);
      // Default to browser mode if there's an error
      setMode('browser');
    }
  }, []);

  const contextValue = {
    mode,
    isPWA: mode === 'pwa',
    isPreview: mode === 'preview'
  };

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
};
