# Timer Storage & Synchronization

This document explains how the Fleek Timer application manages data persistence and synchronization using browser local storage.

## 🎯 Overview

The Fleek Timer app uses a sophisticated local storage system to persist timer data, active timer states, and completed sessions. All data is stored client-side, ensuring privacy and eliminating the need for external databases.

## 🏗️ Storage Architecture

### Storage Keys

```typescript
// Storage keys used throughout the app
const TIMERS_KEY = 'fleek-timers';
const ACTIVE_TIMERS_KEY = 'fleek-active-timers';
const COMPLETED_SESSIONS_KEY = 'fleek-completed-sessions';
const PROJECTS_KEY = 'fleek-projects';
const TASKS_KEY = 'fleek-tasks';
const THEME_KEY = 'fleek-theme';
```

### Data Types Stored

1. **Timer Definitions** (`TimerData[]`)
   - Project and task information
   - Descriptions and metadata
   - Creation timestamps
   - Favorite status

2. **Active Timer States** (`ActiveTimer[]`)
   - Currently running/paused timers
   - Start times and elapsed time
   - Pause states and pause durations
   - Running status flags

3. **Completed Sessions** (`CompletedTimerSession[]`)
   - Finished timer sessions
   - Start/end timestamps
   - Total duration
   - Associated timer data

4. **Projects & Tasks** (`ProjectData[]`, `TaskData[]`)
   - Project and task definitions
   - Hierarchical relationships
   - Creation metadata

## ⚡ Real-time Synchronization

### Timer Context Persistence

The `TimerContext` automatically persists active timer states:

```typescript
// Auto-save on timer state changes
useEffect(() => {
  savePersistedTimers(activeTimers);
}, [activeTimers, lastUpdateTime]);
```

### Live Timer Updates

Active timers are updated every second and automatically saved:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setActiveTimers(prev => {
      const { updatedTimers, hasUpdates } = updateElapsedTimes(prev);
      
      if (hasUpdates) {
        setLastUpdateTime(Date.now()); // Triggers save
        return updatedTimers;
      }
      return prev;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

## 💾 Persistence Functions

### Core Storage Operations

```typescript
// Save timer definitions
export function saveTimer(timer: TimerData): void {
  const timers = getSavedTimers();
  const existingIndex = timers.findIndex(t => t.id === timer.id);
  
  if (existingIndex >= 0) {
    timers[existingIndex] = timer;
  } else {
    timers.push(timer);
  }
  
  localStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
}

// Load timer definitions
export function getSavedTimers(): TimerData[] {
  const stored = localStorage.getItem(TIMERS_KEY);
  if (!stored) return [];
  
  return JSON.parse(stored).map(parseTimerData);
}
```

### Active Timer Persistence

```typescript
// Serialize active timers with date handling
export function savePersistedTimers(activeTimers: ActiveTimer[]): void {
  const serialized: SerializedActiveTimer[] = activeTimers.map(timer => ({
    ...timer,
    startTime: timer.startTime.toISOString(),
    endTime: timer.endTime?.toISOString(),
    lastUpdateTime: new Date().toISOString()
  }));
  
  localStorage.setItem(ACTIVE_TIMERS_KEY, JSON.stringify(serialized));
}

// Deserialize with proper date restoration
export function loadPersistedTimers(): ActiveTimer[] {
  const stored = localStorage.getItem(ACTIVE_TIMERS_KEY);
  if (!stored) return [];
  
  const serialized: SerializedActiveTimer[] = JSON.parse(stored);
  
  return serialized.map(timer => ({
    ...timer,
    startTime: new Date(timer.startTime),
    endTime: timer.endTime ? new Date(timer.endTime) : undefined,
    timerData: {
      ...timer.timerData,
      createdAt: new Date(timer.timerData.createdAt)
    }
  }));
}
```

### Session Storage

```typescript
// Save completed sessions with duplicate prevention
export function saveCompletedSession(session: CompletedTimerSession): void {
  const sessions = getCompletedSessions();
  
  // Prevent duplicates by ID
  const existingSessionById = sessions.find(s => s.id === session.id);
  if (existingSessionById) return;
  
  // Prevent multiple sessions for same timer run
  const existingSessionByTimerRun = sessions.find(s => 
    s.timerId === session.timerId && 
    s.startTime.getTime() === session.startTime.getTime()
  );
  if (existingSessionByTimerRun) return;
  
  sessions.push(session);
  localStorage.setItem(COMPLETED_SESSIONS_KEY, JSON.stringify(sessions));
}
```

## 🔄 Session Recovery

### Application Startup

When the app loads, it automatically recovers active timer states:

```typescript
// In TimerContext
useEffect(() => {
  const restoredTimers = loadPersistedTimers();
  setActiveTimers(restoredTimers);
}, []);
```

### Date/Time Handling

The system properly handles date serialization/deserialization:

```typescript
// Ensure dates are properly restored
const parseTimerData = (data: any): TimerData => ({
  ...data,
  createdAt: new Date(data.createdAt)
});
```

## 🚀 Performance Optimizations

### Conditional Saves

Only save when actual changes occur:

```typescript
const { updatedTimers, hasUpdates } = updateElapsedTimes(prev);

if (hasUpdates) {
  setLastUpdateTime(Date.now()); // Triggers save effect
  return updatedTimers;
}
return prev; // No save needed
```

### Efficient Duplicate Prevention

Multiple layers of duplicate prevention for sessions:

1. **ID-based checking**: Prevents exact duplicates
2. **Timer run checking**: Prevents multiple sessions for same timer session
3. **Race condition protection**: Uses deterministic session IDs

### Batch Operations

Timer state updates are batched to minimize storage writes:

```typescript
// Single update triggers single save
setActiveTimers(prev => createNewTimer(prev, timerData));
```

## 🔍 Data Flow

### Timer Creation Flow

1. User creates timer → `createTimerData()`
2. Timer saved → `saveTimer(timer)`
3. Timer available in list immediately

### Timer Start Flow

1. User starts timer → `startTimer(timerData)`
2. Active timer created → `createNewTimer()`
3. State updated → triggers `savePersistedTimers()`
4. Real-time updates begin → saves every second

### Timer Stop Flow

1. User stops timer → `stopTimer(timerId)`
2. Completed session created → `saveCompletedSession()`
3. Active timer removed → triggers `savePersistedTimers()`
4. Session appears in completed list

## 🛡️ Error Handling

### Storage Availability

```typescript
// Check if localStorage is available
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
```

### Graceful Degradation

- App continues to work without storage (in-memory only)
- Invalid stored data is filtered out
- Missing data structures are created automatically

## 🔧 Debugging Storage

### Browser DevTools

View stored data in browser DevTools:

```javascript
// Console commands for debugging
localStorage.getItem('fleek-timers');
localStorage.getItem('fleek-active-timers');
localStorage.getItem('fleek-completed-sessions');

// Clear all data
localStorage.removeItem('fleek-timers');
localStorage.removeItem('fleek-active-timers');
localStorage.removeItem('fleek-completed-sessions');
```

### Storage Size Monitoring

Local storage has size limits (~5-10MB). The app stores:
- Timer definitions: ~1KB each
- Active timers: ~2KB each
- Sessions: ~1KB each

Typical usage should stay well under limits.

## 🚀 Future Enhancements

Potential improvements to the storage system:

1. **IndexedDB Migration**: For larger data sets
2. **Compression**: Reduce storage footprint
3. **Cloud Sync**: Optional cloud backup/sync
4. **Export/Import**: Data portability features
5. **Storage Quotas**: Monitor and manage storage usage

## 📋 Summary

The Fleek Timer storage system provides:

- ✅ **Reliable Persistence**: All data survives browser restarts
- ✅ **Real-time Sync**: Active timers update and save continuously
- ✅ **Race Condition Protection**: Prevents duplicate sessions
- ✅ **Performance Optimized**: Minimal storage operations
- ✅ **Error Resilient**: Graceful handling of storage issues
- ✅ **Development Friendly**: Easy to debug and inspect

This architecture ensures a smooth, reliable timer experience while maintaining data integrity and performance. 