import { useState, useEffect } from 'react';
import type { ActiveTimer } from '../context/TimerContext';

/**
 * Hook for displaying timer information with real-time updates
 * Provides formatted time display and individual time components
 */
export function useTimerDisplay(timer: ActiveTimer) {
  const [elapsedTime, setElapsedTime] = useState(timer.elapsedTime);

  useEffect(() => {
    if (!timer.isRunning || timer.isPaused) {
      setElapsedTime(timer.elapsedTime);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000) - (timer.pausedTime || 0);
      setElapsedTime(Math.max(0, elapsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.startTime, timer.pausedTime, timer.isRunning, timer.isPaused]);

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = Math.floor(elapsedTime % 60);

  const formattedTime = hours > 0 
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    elapsedTime,
    formattedTime,
    hours,
    minutes,
    seconds,
  };
} 