
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  initialHours, 
  initialMinutes, 
  initialSeconds 
}) => {
  const [time, setTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTime({
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds
    });
    setIsExpired(false);
  }, [initialHours, initialMinutes, initialSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          setIsExpired(true);
          return prev;
        }

        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialHours, initialMinutes, initialSeconds]);

  const getColorScheme = () => {
    const totalMinutes = time.hours * 60 + time.minutes;
    
    if (isExpired) {
      return {
        text: "text-red-500",
        border: "border-red-500",
        shadow: "rgba(239, 63, 54, 0.8)",
        animation: "red-pulse"
      };
    }
    
    if (totalMinutes >= 720) {
      return {
        text: "text-zap-blue",
        border: "border-zap-blue",
        shadow: "rgba(0, 122, 255, 0.8)",
        animation: "blue-pulse"
      };
    } else if (totalMinutes >= 360) {
      return {
        text: "text-zap-yellow",
        border: "border-zap-yellow",
        shadow: "rgba(255, 204, 0, 0.8)",
        animation: "yellow-pulse"
      };
    } else {
      return {
        text: "text-red-500",
        border: "border-red-500",
        shadow: "rgba(239, 63, 54, 0.8)",
        animation: "red-pulse"
      };
    }
  };

  const formatNumber = (num: number) => {
    return String(num).padStart(2, '0');
  };

  const colorScheme = getColorScheme();

  return (
    <div 
      style={{
        textShadow: `0 0 7px ${colorScheme.shadow}, 0 0 10px ${colorScheme.shadow}, 0 0 21px ${colorScheme.shadow}`,
        fontSize: '1.5rem',
        letterSpacing: '2px',
        animation: `${colorScheme.animation} 2s infinite`,
        width: '140px',
      }} 
      className={`bg-black border-2 ${colorScheme.border} ${colorScheme.text} flex items-center justify-center gap-1 font-digital rounded-none px-2 py-1`}
    >
      <style>
        {`
          @keyframes blue-pulse {
            0% { border-color: rgba(0, 122, 255, 0.3); }
            50% { border-color: rgba(0, 122, 255, 1); }
            100% { border-color: rgba(0, 122, 255, 0.3); }
          }
          @keyframes yellow-pulse {
            0% { border-color: rgba(255, 204, 0, 0.3); }
            50% { border-color: rgba(255, 204, 0, 1); }
            100% { border-color: rgba(255, 204, 0, 0.3); }
          }
          @keyframes red-pulse {
            0% { border-color: rgba(239, 63, 54, 0.3); }
            50% { border-color: rgba(239, 63, 54, 1); }
            100% { border-color: rgba(239, 63, 54, 0.3); }
          }
        `}
      </style>
      <span className="w-full text-center">
        {isExpired ? "CLOSED" : `${formatNumber(time.hours)}:${formatNumber(time.minutes)}:${formatNumber(time.seconds)}`}
      </span>
    </div>
  );
};

export default CountdownTimer;
