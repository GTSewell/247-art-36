
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppModeContextType {
  isPWA: boolean;
  setIsPWA: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const useAppMode = (): AppModeContextType => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error("useAppMode must be used within an AppModeProvider");
  }
  return context;
};

interface AppModeProviderProps {
  children: ReactNode;
}

export const AppModeProvider: React.FC<AppModeProviderProps> = ({ children }) => {
  const [isPWA, setIsPWA] = useState<boolean>(false);

  useEffect(() => {
    // Check if the app is running in standalone mode (PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsPWA(isStandalone);
    
    // Listen for changes in display mode
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches);
    };
    
    // Use the correct event listener based on browser support
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQueryList.addListener(handleChange);
    }
    
    return () => {
      // Clean up the event listener
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <AppModeContext.Provider value={{ isPWA, setIsPWA }}>
      {children}
    </AppModeContext.Provider>
  );
};

export default AppModeProvider;
