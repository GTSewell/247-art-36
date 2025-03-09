import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { isLovablePreview, isPWAMode } from '../utils/environmentDetector';

// Create a fallback context in case it's accessed outside a provider
const EMPTY_FUNCTION = () => {};
const DEFAULT_VALUE = {
  mode: 'browser' as const,
  isPWA: false,
  isPreview: false,
};

type AppMode = 'pwa' | 'browser' | 'preview';

interface AppModeContextType {
  mode: AppMode;
  isPWA: boolean;
  isPreview: boolean;
}

// Create the context with default values
const AppModeContext = createContext<AppModeContextType>(DEFAULT_VALUE);

// Custom hook with safety checks
export const useAppMode = () => {
  const context = useContext(AppModeContext);
  // If context is undefined, we're outside the provider, return default value
  if (!context) {
    logger.warn('useAppMode called outside of AppModeProvider, using default values');
    return DEFAULT_VALUE;
  }
  return context;
};

export const AppModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('browser');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Early detection for Lovable preview
      if (isLovablePreview()) {
        logger.info('Running in Lovable preview environment');
        setMode('preview');
        setIsInitialized(true);
        return;
      }

      // Standard PWA detection
      const checkPWAMode = () => {
        const inPWAMode = isPWAMode();
        setMode(inPWAMode ? 'pwa' : 'browser');
        logger.info(`App mode set to: ${inPWAMode ? 'pwa' : 'browser'}`);
        setIsInitialized(true);
      };

      // Initial check
      checkPWAMode();

      // Set up listener for changes
      const handleDisplayModeChange = (evt: MediaQueryListEvent) => {
        const newMode = evt.matches ? 'pwa' : 'browser';
        logger.info(`Display mode changed to: ${newMode}`);
        setMode(newMode);
      };

      // Add listener if supported
      if (typeof window !== 'undefined' && window.matchMedia) {
        const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
        try {
          displayModeMediaQuery.addEventListener('change', handleDisplayModeChange);
          return () => {
            displayModeMediaQuery.removeEventListener('change', handleDisplayModeChange);
          };
        } catch (err) {
          // Fallback for older browsers that don't support addEventListener
          logger.warn('Using fallback for display mode change detection');
          // @ts-ignore - for older browsers
          displayModeMediaQuery.addListener && displayModeMediaQuery.addListener(handleDisplayModeChange);
          return () => {
            // @ts-ignore - for older browsers
            displayModeMediaQuery.removeListener && displayModeMediaQuery.removeListener(handleDisplayModeChange);
          };
        }
      }
    } catch (error) {
      logger.error('Error in AppModeProvider:', error);
      // Default to browser mode if there's an error
      setMode('browser');
      setIsInitialized(true);
    }
  }, []);

  // Wait until we're sure about the mode before rendering children
  if (!isInitialized && typeof window !== 'undefined' && !isLovablePreview()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Initializing application...</p>
      </div>
    );
  }

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

// Export a ModeAwareProvider that wraps components that need AppMode
// This is useful for components that might be used outside the normal app flow
export const ModeAwareProvider = ({ children }: { children: React.ReactNode }) => {
  // If we're already inside an AppModeContext, use that
  const existingContext = useContext(AppModeContext);

  if (existingContext !== DEFAULT_VALUE) {
    // We're already inside an AppModeProvider, just render children
    return <>{children}</>;
  }

  // Otherwise, wrap in a new provider
  return <AppModeProvider>{children}</AppModeProvider>;
};
