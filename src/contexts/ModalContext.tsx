import React, { createContext, useContext, useEffect } from 'react';

interface ModalContextType {
  isInModal: boolean;
}

const ModalContext = createContext<ModalContextType>({ isInModal: false });

export const useModalContext = () => useContext(ModalContext);

interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * ModalProvider should wrap modal content to indicate that child components
 * are inside a modal and should use higher z-index values
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  useEffect(() => {
    // Set data attribute on body to indicate modal context for CSS
    document.body.setAttribute('data-modal-context', 'true');
    
    return () => {
      document.body.removeAttribute('data-modal-context');
    };
  }, []);

  return (
    <ModalContext.Provider value={{ isInModal: true }}>
      <div data-modal-context="true">
        {children}
      </div>
    </ModalContext.Provider>
  );
};

/**
 * Hook to determine if we're inside a modal context
 */
export const useInModal = (): boolean => {
  const context = useModalContext();
  return context.isInModal;
};