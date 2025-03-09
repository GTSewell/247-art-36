
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScrollPositionContextType {
  saveScrollPosition: (key: string, position: number) => void;
  getScrollPosition: (key: string) => number;
  clearScrollPosition: (key: string) => void;
}

const ScrollPositionContext = createContext<ScrollPositionContextType>({
  saveScrollPosition: () => {},
  getScrollPosition: () => 0,
  clearScrollPosition: () => {},
});

export const useScrollPosition = () => useContext(ScrollPositionContext);

export const ScrollPositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  // Load saved positions from localStorage on mount
  useEffect(() => {
    try {
      const savedPositions = localStorage.getItem('scrollPositions');
      if (savedPositions) {
        setScrollPositions(JSON.parse(savedPositions));
      }
    } catch (error) {
      console.error('Failed to load scroll positions from localStorage:', error);
    }
  }, []);

  // Save positions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
    } catch (error) {
      console.error('Failed to save scroll positions to localStorage:', error);
    }
  }, [scrollPositions]);

  const saveScrollPosition = (key: string, position: number) => {
    setScrollPositions(prev => ({ ...prev, [key]: position }));
  };

  const getScrollPosition = (key: string) => {
    return scrollPositions[key] || 0;
  };

  const clearScrollPosition = (key: string) => {
    setScrollPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[key];
      return newPositions;
    });
  };

  return (
    <ScrollPositionContext.Provider value={{ saveScrollPosition, getScrollPosition, clearScrollPosition }}>
      {children}
    </ScrollPositionContext.Provider>
  );
};
