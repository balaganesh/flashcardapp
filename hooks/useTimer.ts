
import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerOptions {
  initialTime: number; // in seconds
  onTick?: (timeLeft: number) => void;
  onTimeout?: () => void;
  autoStart?: boolean;
}

interface TimerControls {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
}

export const useTimer = ({ initialTime, onTick, onTimeout, autoStart = false }: TimerOptions): TimerControls => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null); // Changed NodeJS.Timeout to number

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) { // Check for null explicitly
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  const tick = useCallback(() => {
    setTimeLeft(prevTime => {
      if (prevTime <= 1) {
        clearTimerInterval();
        setIsRunning(false);
        if (onTimeout) {
          onTimeout();
        }
        return 0;
      }
      const newTime = prevTime - 1;
      if (onTick) {
        onTick(newTime);
      }
      return newTime;
    });
  }, [clearTimerInterval, onTick, onTimeout]);


  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(tick, 1000); // Use window.setInterval for clarity
    } else {
      clearTimerInterval();
    }
    return clearTimerInterval; // Cleanup on unmount or if dependencies change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft, tick]); 

  const start = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  }, [isRunning, timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    clearTimerInterval();
    setIsRunning(autoStart); // Respect autoStart on reset
    setTimeLeft(newTime !== undefined ? newTime : initialTime);
  }, [clearTimerInterval, autoStart, initialTime]);

  return { timeLeft, isRunning, start, pause, reset };
};
