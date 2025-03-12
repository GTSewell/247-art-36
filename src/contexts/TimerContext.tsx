
import React, { createContext, useContext, useState } from 'react';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface TimerContextType {
  timerStates: Record<string, TimerState>;
  updateTimerState: (productId: string, state: TimerState) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [timerStates, setTimerStates] = useState<Record<string, TimerState>>({});

  const updateTimerState = (productId: string, state: TimerState) => {
    setTimerStates(prev => ({
      ...prev,
      [productId]: state
    }));
  };

  return (
    <TimerContext.Provider value={{ timerStates, updateTimerState }}>
      {children}
    </TimerContext.Provider>
  );
};

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
