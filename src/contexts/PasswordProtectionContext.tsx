
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PasswordProtectionContextProps {
  isPasswordCorrect: boolean;
  setIsPasswordCorrect: (isCorrect: boolean) => void;
  clearPasswordStatus: () => void;
}

const PasswordProtectionContext = createContext<PasswordProtectionContextProps | undefined>(undefined);

export const PasswordProtectionProvider = ({ children }: { children: ReactNode }) => {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  
  // Check localStorage for password verification on mount
  useEffect(() => {
    const storedPasswordStatus = localStorage.getItem("isPasswordCorrect");
    if (storedPasswordStatus === "true") {
      setIsPasswordCorrect(true);
    }
  }, []);
  
  const clearPasswordStatus = () => {
    localStorage.removeItem("isPasswordCorrect");
    setIsPasswordCorrect(false);
  };
  
  return (
    <PasswordProtectionContext.Provider value={{ 
      isPasswordCorrect, 
      setIsPasswordCorrect,
      clearPasswordStatus
    }}>
      {children}
    </PasswordProtectionContext.Provider>
  );
};

export const usePasswordProtection = (): PasswordProtectionContextProps => {
  const context = useContext(PasswordProtectionContext);
  if (context === undefined) {
    throw new Error('usePasswordProtection must be used within a PasswordProtectionProvider');
  }
  return context;
};
