import { createContext, useContext, useEffect, useState } from 'react';
import type TimerData from '../interfaces/TimerData';
import { loadPersistedTimers, savePersistedTimers } from '../utils/timer/persistence';
import {
  createNewTimer,
  stopActiveTimer,
  pauseActiveTimer,
  resumeActiveTimer,
  updateElapsedTimes,
  getActiveTimerById,
  getCurrentRunningTimer,
  hasActiveRunningTimers,
  calculateTotalActiveTime
} from '../utils/timer/actions';

export interface ActiveTimer {
  id: string;
  timerData: TimerData;
  startTime: Date;
  endTime?: Date;
  pausedTime?: number; // Total paused time in seconds
  isPaused: boolean;
  isRunning: boolean;
  elapsedTime: number; // Current elapsed time in seconds
}

interface TimerContextType {
  activeTimers: ActiveTimer[];
  startTimer: (timerData: TimerData) => void;
  stopTimer: (timerId: string) => void;
  pauseTimer: (timerId: string) => void;
  resumeTimer: (timerId: string) => void;
  getActiveTimer: (timerId: string) => ActiveTimer | undefined;
  getCurrentTimer: () => ActiveTimer | undefined;
  hasActiveTimers: boolean;
  totalActiveTime: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Load persisted timers on mount
  useEffect(() => {
    const restoredTimers = loadPersistedTimers();
    setActiveTimers(restoredTimers);
  }, []);

  // Persist timers to localStorage
  useEffect(() => {
    savePersistedTimers(activeTimers);
  }, [activeTimers, lastUpdateTime]);

  // Update elapsed time for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const { updatedTimers, hasUpdates } = updateElapsedTimes(prev);
        
        if (hasUpdates) {
          setLastUpdateTime(Date.now());
          return updatedTimers;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = (timerData: TimerData) => {
    setActiveTimers(prev => createNewTimer(prev, timerData));
  };

  const stopTimer = (timerId: string) => {
    setActiveTimers(prev => stopActiveTimer(prev, timerId));
  };

  const pauseTimer = (timerId: string) => {
    setActiveTimers(prev => pauseActiveTimer(prev, timerId));
  };

  const resumeTimer = (timerId: string) => {
    setActiveTimers(prev => resumeActiveTimer(prev, timerId));
  };

  const getActiveTimer = (timerId: string) => {
    return getActiveTimerById(activeTimers, timerId);
  };

  const getCurrentTimer = () => {
    return getCurrentRunningTimer(activeTimers);
  };

  const hasActiveTimers = hasActiveRunningTimers(activeTimers);
  const totalActiveTime = calculateTotalActiveTime(activeTimers);

  return (
    <TimerContext.Provider
      value={{
        activeTimers,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        getActiveTimer,
        getCurrentTimer,
        hasActiveTimers,
        totalActiveTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 