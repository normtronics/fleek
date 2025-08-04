import type TimerData from '../interfaces/TimerData';

const STORAGE_KEYS = {
  TIMERS: 'fleek_timers',
  FAVORITES: 'fleek_favorite_timers',
} as const;

/**
 * Saves a timer to localStorage
 */
export function saveTimer(timer: TimerData): void {
  try {
    const existingTimers = getTimers();
    const updatedTimers = [...existingTimers, timer];
    localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(updatedTimers));
  } catch (error) {
    console.error('Failed to save timer:', error);
    throw new Error('Failed to save timer');
  }
}

/**
 * Retrieves all timers from localStorage
 */
export function getTimers(): TimerData[] {
  try {
    const timersJson = localStorage.getItem(STORAGE_KEYS.TIMERS);
    if (!timersJson) return [];
    
    const timers = JSON.parse(timersJson);
    return timers.map((timer: any) => ({
      ...timer,
      createdAt: new Date(timer.createdAt),
    }));
  } catch (error) {
    console.error('Failed to retrieve timers:', error);
    return [];
  }
}

/**
 * Deletes a timer by ID
 */
export function deleteTimer(timerId: string): void {
  try {
    const existingTimers = getTimers();
    const updatedTimers = existingTimers.filter(timer => timer.id !== timerId);
    localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(updatedTimers));
  } catch (error) {
    console.error('Failed to delete timer:', error);
    throw new Error('Failed to delete timer');
  }
}

/**
 * Updates a timer
 */
export function updateTimer(updatedTimer: TimerData): void {
  try {
    const existingTimers = getTimers();
    const updatedTimers = existingTimers.map(timer => 
      timer.id === updatedTimer.id ? updatedTimer : timer
    );
    localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(updatedTimers));
  } catch (error) {
    console.error('Failed to update timer:', error);
    throw new Error('Failed to update timer');
  }
}

/**
 * Gets favorite timers
 */
export function getFavoriteTimers(): TimerData[] {
  return getTimers().filter(timer => timer.isFavorite);
}

/**
 * Toggles timer favorite status
 */
export function toggleTimerFavorite(timerId: string): void {
  try {
    const existingTimers = getTimers();
    const updatedTimers = existingTimers.map(timer => 
      timer.id === timerId 
        ? { ...timer, isFavorite: !timer.isFavorite }
        : timer
    );
    localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(updatedTimers));
  } catch (error) {
    console.error('Failed to toggle timer favorite:', error);
    throw new Error('Failed to toggle timer favorite');
  }
}

/**
 * Clears all timers (useful for testing)
 */
export function clearAllTimers(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TIMERS);
  } catch (error) {
    console.error('Failed to clear timers:', error);
    throw new Error('Failed to clear timers');
  }
}

/**
 * Checks if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
} 