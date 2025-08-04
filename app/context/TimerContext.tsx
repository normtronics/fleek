import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type TimerData from '../interfaces/TimerData';
import { saveTimer } from '../utils/storage';
import { getProjectById, getTaskById } from '../utils/projects';

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

const STORAGE_KEY = 'fleek_active_timers';

interface SerializedActiveTimer {
  id: string;
  timerData: TimerData;
  startTime: string;
  endTime?: string;
  pausedTime?: number;
  isPaused: boolean;
  isRunning: boolean;
  lastUpdateTime: string;
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Load persisted timers on mount
  useEffect(() => {
    const loadPersistedTimers = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const serialized: SerializedActiveTimer[] = JSON.parse(stored);
          const now = new Date();
          
          const restoredTimers: ActiveTimer[] = serialized
            .filter(timer => timer.isRunning) // Only restore running timers
            .map(timer => {
              const startTime = new Date(timer.startTime);
              const lastUpdate = new Date(timer.lastUpdateTime);
              const pausedTime = timer.pausedTime || 0;
              
              // Calculate elapsed time accounting for time passed while app was closed
              let additionalTime = 0;
              if (!timer.isPaused) {
                additionalTime = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
              }
              
              const totalElapsed = Math.floor((lastUpdate.getTime() - startTime.getTime()) / 1000) - pausedTime + additionalTime;
              
              return {
                id: timer.id,
                timerData: {
                  ...timer.timerData,
                  createdAt: new Date(timer.timerData.createdAt),
                },
                startTime,
                endTime: timer.endTime ? new Date(timer.endTime) : undefined,
                pausedTime,
                isPaused: timer.isPaused,
                isRunning: timer.isRunning,
                elapsedTime: Math.max(0, totalElapsed),
              };
            });
          
          setActiveTimers(restoredTimers);
        }
      } catch (error) {
        console.error('Failed to load persisted timers:', error);
      }
    };

    loadPersistedTimers();
  }, []);

  // Persist timers to localStorage whenever they change
  useEffect(() => {
    const persistTimers = () => {
      try {
        const serialized: SerializedActiveTimer[] = activeTimers.map(timer => ({
          id: timer.id,
          timerData: timer.timerData,
          startTime: timer.startTime.toISOString(),
          endTime: timer.endTime?.toISOString(),
          pausedTime: timer.pausedTime,
          isPaused: timer.isPaused,
          isRunning: timer.isRunning,
          lastUpdateTime: new Date().toISOString(),
        }));
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
      } catch (error) {
        console.error('Failed to persist timers:', error);
      }
    };

    if (activeTimers.length > 0) {
      persistTimers();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeTimers]);

  // Update elapsed time every second for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveTimers(prev => 
        prev.map(timer => {
          if (timer.isRunning && !timer.isPaused) {
            const totalTime = Math.floor((now - timer.startTime.getTime()) / 1000);
            const pausedTime = timer.pausedTime || 0;
            return {
              ...timer,
              elapsedTime: Math.max(0, totalTime - pausedTime),
            };
          }
          return timer;
        })
      );
      setLastUpdateTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = useCallback((timerData: TimerData) => {
    const newTimer: ActiveTimer = {
      id: timerData.id,
      timerData,
      startTime: new Date(),
      isPaused: false,
      isRunning: true,
      elapsedTime: 0,
      pausedTime: 0,
    };

    setActiveTimers(prev => {
      // Stop any existing timer for the same timer data
      const filtered = prev.filter(t => t.id !== timerData.id);
      return [...filtered, newTimer];
    });
  }, []);

  const stopTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => {
      const timer = prev.find(t => t.id === timerId);
      if (timer) {
        // Save the completed timer to storage
        const completedTimer: TimerData = {
          ...timer.timerData,
          // You might want to add duration or other completion data here
        };
        saveTimer(completedTimer);
      }
      
      return prev.filter(t => t.id !== timerId);
    });
  }, []);

  const pauseTimer = useCallback((timerId: string) => {
    setActiveTimers(prev =>
      prev.map(timer => {
        if (timer.id === timerId && timer.isRunning && !timer.isPaused) {
          return {
            ...timer,
            isPaused: true,
          };
        }
        return timer;
      })
    );
  }, []);

  const resumeTimer = useCallback((timerId: string) => {
    setActiveTimers(prev =>
      prev.map(timer => {
        if (timer.id === timerId && timer.isRunning && timer.isPaused) {
          const now = Date.now();
          const pauseStartTime = now - (timer.elapsedTime * 1000) - timer.startTime.getTime();
          const additionalPausedTime = Math.floor(pauseStartTime / 1000);
          
          return {
            ...timer,
            isPaused: false,
            pausedTime: (timer.pausedTime || 0) + Math.max(0, additionalPausedTime),
          };
        }
        return timer;
      })
    );
  }, []);

  const getActiveTimer = useCallback((timerId: string) => {
    return activeTimers.find(timer => timer.id === timerId);
  }, [activeTimers]);

  const getCurrentTimer = useCallback(() => {
    // Return the most recently started timer
    return activeTimers
      .filter(timer => timer.isRunning)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0];
  }, [activeTimers]);

  const hasActiveTimers = activeTimers.some(timer => timer.isRunning && !timer.isPaused);
  
  const totalActiveTime = activeTimers
    .filter(timer => timer.isRunning && !timer.isPaused)
    .reduce((total, timer) => total + timer.elapsedTime, 0);

  const value: TimerContextType = {
    activeTimers,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    getActiveTimer,
    getCurrentTimer,
    hasActiveTimers,
    totalActiveTime,
  };

  return (
    <TimerContext.Provider value={value}>
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

// Utility hook for formatting timer display
export function useTimerDisplay(timer: ActiveTimer) {
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const projectName = getProjectById(timer.timerData.project)?.label || 'Unknown Project';
  const taskName = getTaskById(timer.timerData.task)?.label || 'Unknown Task';
  
  return {
    formattedTime: formatTime(timer.elapsedTime),
    projectName,
    taskName,
    description: timer.timerData.description,
    isRunning: timer.isRunning && !timer.isPaused,
    isPaused: timer.isPaused,
    isFavorite: timer.timerData.isFavorite,
  };
} 