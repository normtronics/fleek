import type TimerData from '../interfaces/TimerData';
import type { CompletedTimerSession } from '../interfaces/TimerData';

const STORAGE_KEY = 'fleek_timers';
const COMPLETED_SESSIONS_KEY = 'fleek_completed_sessions';

export function saveTimer(timerData: TimerData): void {
  const timers = getTimers();
  const existingIndex = timers.findIndex(t => t.id === timerData.id);
  
  if (existingIndex >= 0) {
    timers[existingIndex] = timerData;
  } else {
    timers.push(timerData);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
}

export function getTimers(): TimerData[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const timers = JSON.parse(stored);
    return timers.map((timer: any) => ({
      ...timer,
      createdAt: new Date(timer.createdAt)
    }));
  } catch {
    return [];
  }
}

export function deleteTimer(timerId: string): void {
  const timers = getTimers();
  const filtered = timers.filter(t => t.id !== timerId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateTimer(updatedTimer: TimerData): void {
  try {
    const existingTimers = getTimers();
    const updatedTimers = existingTimers.map(timer => 
      timer.id === updatedTimer.id ? updatedTimer : timer
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTimers));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTimers));
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
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear timers:', error);
    throw new Error('Failed to clear timers');
  }
} 

export function saveCompletedSession(session: CompletedTimerSession): void {
  const sessions = getCompletedSessions();
  
  // Check if this session already exists by ID to prevent duplicates
  const existingSessionById = sessions.find(s => s.id === session.id);
  if (existingSessionById) {
    console.warn('Attempted to save duplicate session by ID:', session.id);
    return; // Don't save duplicate
  }
  
  // Additional check: prevent multiple sessions for the same timer run
  // (same timerId + same startTime combination)
  const existingSessionByTimerRun = sessions.find(s => 
    s.timerId === session.timerId && 
    s.startTime.getTime() === session.startTime.getTime()
  );
  if (existingSessionByTimerRun) {
    console.warn('Attempted to save duplicate session for same timer run:', {
      timerId: session.timerId,
      startTime: session.startTime.getTime(),
      existingId: existingSessionByTimerRun.id,
      newId: session.id
    });
    return; // Don't save duplicate
  }
  
  sessions.push(session);
  localStorage.setItem(COMPLETED_SESSIONS_KEY, JSON.stringify(sessions));
}

export function getCompletedSessions(): CompletedTimerSession[] {
  const stored = localStorage.getItem(COMPLETED_SESSIONS_KEY);
  if (!stored) return [];
  
  try {
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: new Date(session.endTime),
      completedAt: new Date(session.completedAt),
      timerData: {
        ...session.timerData,
        createdAt: new Date(session.timerData.createdAt)
      }
    }));
  } catch {
    return [];
  }
}

export function getCompletedSessionsForTimer(timerId: string): CompletedTimerSession[] {
  return getCompletedSessions().filter(session => session.timerId === timerId);
} 