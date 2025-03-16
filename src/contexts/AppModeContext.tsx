
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
    // We explicitly check user agent for mobile devices to ensure desktop browsers don't trigger PWA mode
    const isStandalone = 
      (window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://'));
    
    // Check if it's a mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Set PWA mode only if it's both standalone AND mobile, or if it was explicitly set
    setIsPWA(isStandalone && isMobileDevice);
    
    // Listen for changes in display mode
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only enable PWA mode if it's a mobile device
      setIsPWA(e.matches && isMobileDevice);
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
