
import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  createdAt: string;
  expiryHours: number;
  className?: string;
}

const CountdownTimer = ({ createdAt, expiryHours = 24, className }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 0, minutes: 0, seconds: 0 
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expiryTime = createdTime + (expiryHours * 60 * 60 * 1000);
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, expiryHours]);

  if (isExpired) {
    return (
      <div className={cn("flex items-center text-red-500 font-medium text-sm", className)}>
        <Timer className="w-4 h-4 mr-1" />
        Expired
      </div>
    );
  }

  return (
    <div className={cn("flex items-center text-amber-600 font-medium text-sm", className)}>
      <Timer className="w-4 h-4 mr-1" />
      {timeLeft.hours.toString().padStart(2, '0')}h{' '}
      {timeLeft.minutes.toString().padStart(2, '0')}m{' '}
      {timeLeft.seconds.toString().padStart(2, '0')}s remaining
    </div>
  );
};

export default CountdownTimer;
