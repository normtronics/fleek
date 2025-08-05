import type TimerData from '../../interfaces/TimerData';
import type { CompletedTimerSession } from '../../interfaces/TimerData';
import type { ActiveTimer } from '../../context/TimerContext';
import { saveCompletedSession } from '../storage';

/**
 * Creates a new timer and returns updated active timers array
 */
export function createNewTimer(
  activeTimers: ActiveTimer[],
  timerData: TimerData
): ActiveTimer[] {
  const newTimer: ActiveTimer = {
    id: timerData.id,
    timerData,
    startTime: new Date(),
    isPaused: false,
    isRunning: true,
    elapsedTime: 0,
    pausedTime: 0,
  };

  // Stop any existing timer for the same timer data to prevent duplicates
  const filtered = activeTimers.filter(t => t.id !== timerData.id);
  return [...filtered, newTimer];
}

/**
 * Stops a timer and creates a completed session, returns updated active timers array
 */
export function stopActiveTimer(
  activeTimers: ActiveTimer[],
  timerId: string
): ActiveTimer[] {
  const timer = activeTimers.find(t => t.id === timerId);
  if (timer) {
    const endTime = new Date();
    const totalTime = Math.max(0, Math.floor(timer.elapsedTime));
    
    // Create session ID based on timer ID and start time to ensure uniqueness per session
    // This prevents race conditions from creating multiple sessions for the same timer run
    const sessionId = `session_${timer.id}_${timer.startTime.getTime()}`;
    
    const completedSession: CompletedTimerSession = {
      id: sessionId,
      timerId: timer.id,
      timerData: timer.timerData,
      startTime: timer.startTime,
      endTime,
      totalTime,
      completedAt: endTime,
    };
    
    // Save the completed session
    saveCompletedSession(completedSession);
  }
  
  return activeTimers.filter(t => t.id !== timerId);
}

/**
 * Pauses a timer, returns updated active timers array
 */
export function pauseActiveTimer(
  activeTimers: ActiveTimer[],
  timerId: string
): ActiveTimer[] {
  return activeTimers.map(timer => {
    if (timer.id === timerId && timer.isRunning && !timer.isPaused) {
      // Calculate the current elapsed time before pausing
      const currentElapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000) - (timer.pausedTime || 0);
      
      return {
        ...timer,
        isPaused: true,
        elapsedTime: Math.max(0, currentElapsed), // Preserve the elapsed time
        pausedTime: timer.pausedTime || 0, // Keep existing paused time for resume calculation
      };
    }
    return timer;
  });
}

/**
 * Resumes a paused timer, returns updated active timers array
 */
export function resumeActiveTimer(
  activeTimers: ActiveTimer[],
  timerId: string
): ActiveTimer[] {
  return activeTimers.map(timer => {
    if (timer.id === timerId && timer.isRunning && timer.isPaused) {
      const now = Date.now();
      
      return {
        ...timer,
        isPaused: false,
        // Update startTime to account for the time spent paused
        // This way the elapsed time calculation continues from where it left off
        startTime: new Date(now - (timer.elapsedTime * 1000)),
        pausedTime: 0, // Reset paused time since we're adjusting startTime
      };
    }
    return timer;
  });
}

/**
 * Updates elapsed time for all running timers
 */
export function updateElapsedTimes(activeTimers: ActiveTimer[]): {
  updatedTimers: ActiveTimer[];
  hasUpdates: boolean;
} {
  let hasUpdates = false;
  const updatedTimers = activeTimers.map(timer => {
    if (timer.isRunning && !timer.isPaused) {
      hasUpdates = true;
      const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000) - (timer.pausedTime || 0);
      return { ...timer, elapsedTime: Math.max(0, elapsed) };
    }
    // For paused timers, preserve their current elapsed time (don't update it)
    return timer;
  });
  
  return { updatedTimers, hasUpdates };
}

/**
 * Gets active timer by ID
 */
export function getActiveTimerById(
  activeTimers: ActiveTimer[],
  timerId: string
): ActiveTimer | undefined {
  return activeTimers.find(timer => timer.id === timerId);
}

/**
 * Gets the current running timer (not paused)
 */
export function getCurrentRunningTimer(activeTimers: ActiveTimer[]): ActiveTimer | undefined {
  return activeTimers.find(timer => timer.isRunning && !timer.isPaused);
}

/**
 * Checks if there are any active timers
 */
export function hasActiveRunningTimers(activeTimers: ActiveTimer[]): boolean {
  return activeTimers.some(timer => timer.isRunning && !timer.isPaused);
}

/**
 * Calculates total active time across all running timers
 */
export function calculateTotalActiveTime(activeTimers: ActiveTimer[]): number {
  return activeTimers
    .filter(timer => timer.isRunning && !timer.isPaused)
    .reduce((total, timer) => total + Math.max(0, timer.elapsedTime), 0);
} 