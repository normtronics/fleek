import type { ActiveTimer } from '../../context/TimerContext';

const STORAGE_KEY = 'fleek_active_timers';

export interface SerializedActiveTimer {
  id: string;
  timerData: {
    project: string;
    task: string;
    description: string;
    isFavorite: boolean;
    createdAt: string;
    id: string;
  };
  startTime: string;
  endTime?: string;
  pausedTime?: number;
  isPaused: boolean;
  isRunning: boolean;
  lastUpdateTime: string;
}

/**
 * Loads persisted active timers from localStorage and restores them with updated elapsed times
 */
export function loadPersistedTimers(): ActiveTimer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const serializedTimers: SerializedActiveTimer[] = JSON.parse(stored);
    const now = Date.now();
    
    const restoredTimers = serializedTimers
      .filter(serialized => serialized.isRunning) // Only restore running timers
      .map(serialized => {
        const timeSinceLastUpdate = Math.floor((now - new Date(serialized.lastUpdateTime).getTime()) / 1000);
        const baseElapsedTime = Math.floor((new Date(serialized.lastUpdateTime).getTime() - new Date(serialized.startTime).getTime()) / 1000);
        
        let elapsedTime = baseElapsedTime;
        if (serialized.isRunning && !serialized.isPaused) {
          elapsedTime += timeSinceLastUpdate;
        }
        
        return {
          ...serialized,
          startTime: new Date(serialized.startTime),
          endTime: serialized.endTime ? new Date(serialized.endTime) : undefined,
          timerData: {
            ...serialized.timerData,
            createdAt: new Date(serialized.timerData.createdAt)
          },
          elapsedTime: Math.max(0, elapsedTime),
          pausedTime: serialized.pausedTime || 0
        };
      });
    
    return restoredTimers;
  } catch (error) {
    console.error('Failed to load persisted timers:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/**
 * Saves active timers to localStorage
 */
export function savePersistedTimers(activeTimers: ActiveTimer[]): void {
  try {
    const serializedTimers: SerializedActiveTimer[] = activeTimers.map(timer => ({
      id: timer.id,
      timerData: {
        ...timer.timerData,
        createdAt: timer.timerData.createdAt.toISOString()
      },
      startTime: timer.startTime.toISOString(),
      endTime: timer.endTime?.toISOString(),
      pausedTime: timer.pausedTime,
      isPaused: timer.isPaused,
      isRunning: timer.isRunning,
      lastUpdateTime: new Date().toISOString()
    }));
    
    if (serializedTimers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedTimers));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to persist timers:', error);
  }
}

/**
 * Clears all persisted timer data
 */
export function clearPersistedTimers(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted timers:', error);
  }
} 