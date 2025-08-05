# Context Architecture

This document provides an in-depth guide to the React Context architecture used in the Fleek Timer application, covering state management patterns and cross-component communication.

## 🎯 Overview

The Fleek Timer app uses React Context API for managing global application state. Two primary contexts handle different aspects of the application:

1. **TimerContext** - Timer state management and operations
2. **ThemeContext** - UI theme and appearance management

## 🕐 TimerContext Architecture

### Purpose & Scope

The TimerContext manages all timer-related state and operations across the application, providing:
- Active timer state management
- Timer lifecycle operations (start, stop, pause, resume)
- Real-time timer updates
- Data persistence coordination
- Cross-component timer state synchronization

### Context Interface

```typescript
interface TimerContextType {
  activeTimers: ActiveTimer[];
  startTimer: (timerData: TimerData) => void;
  stopTimer: (timerId: string) => void;
  pauseTimer: (timerId: string) => void;
  resumeTimer: (timerId: string) => void;
  getActiveTimer: (timerId: string) => ActiveTimer | undefined;
  getCurrentTimer: () => ActiveTimer | undefined;
  totalActiveTime: number;
}
```

### Core State Management

#### Active Timer State
```typescript
const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);
const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
```

**ActiveTimer Interface**:
```typescript
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
```

#### Real-time Updates

The context implements a sophisticated real-time update system:

```typescript
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
```

**Key Features**:
- ✅ **1-second intervals**: Timers update every second for real-time display
- ✅ **Conditional updates**: Only triggers state changes when timers are actually running
- ✅ **Performance optimized**: Prevents unnecessary re-renders
- ✅ **Automatic persistence**: Updates trigger storage saves

### Timer Operations

#### Start Timer
```typescript
const startTimer = (timerData: TimerData) => {
  setActiveTimers(prev => createNewTimer(prev, timerData));
};
```

**Process Flow**:
1. Creates new `ActiveTimer` with current timestamp
2. Adds to active timers array
3. Triggers persistence effect
4. Begins real-time updates

#### Stop Timer
```typescript
const stopTimer = (timerId: string) => {
  setActiveTimers(prev => stopActiveTimer(prev, timerId));
};
```

**Process Flow**:
1. Finds active timer by ID
2. Calculates total elapsed time
3. Creates completed session record
4. Removes from active timers
5. Persists both active timers and completed session

#### Pause/Resume Operations
```typescript
const pauseTimer = (timerId: string) => {
  setActiveTimers(prev => pauseActiveTimer(prev, timerId));
};

const resumeTimer = (timerId: string) => {
  setActiveTimers(prev => resumeActiveTimer(prev, timerId));
};
```

**Pause Logic**:
- Preserves current elapsed time
- Sets `isPaused: true`
- Stops real-time updates for that timer

**Resume Logic**:
- Adjusts start time to account for elapsed time
- Resets pause state
- Resumes real-time updates

### Persistence Integration

#### Automatic Persistence
```typescript
useEffect(() => {
  savePersistedTimers(activeTimers);
}, [activeTimers, lastUpdateTime]);
```

#### Session Recovery
```typescript
useEffect(() => {
  const restoredTimers = loadPersistedTimers();
  setActiveTimers(restoredTimers);
}, []);
```

**Recovery Features**:
- ✅ **Date restoration**: Properly deserializes Date objects
- ✅ **State validation**: Ensures timer states are valid
- ✅ **Graceful degradation**: Handles corrupted data

### Context Usage Patterns

#### Hook Integration
```typescript
// Custom hook for easy context access
export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
```

#### Component Usage Examples

**Timer Controls**:
```typescript
const { startTimer, stopTimer, pauseTimer, resumeTimer } = useTimer();

const handleStart = () => startTimer(timerData);
const handleStop = () => stopTimer(timer.id);
```

**Timer Display**:
```typescript
const { getActiveTimer } = useTimer();
const activeTimer = getActiveTimer(timer.id);
const isActive = !!activeTimer;
```

**Timer Statistics**:
```typescript
const { totalActiveTime } = useTimer();
// Real-time total of all active timer durations
```

## 🎨 ThemeContext Architecture

### Purpose & Scope

The ThemeContext manages application-wide theme state and provides theme switching capabilities:
- Light/dark theme management
- System preference detection
- Theme persistence
- CSS class application

### Context Interface

```typescript
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

type Theme = 'light' | 'dark' | 'system';
```

### Theme State Management

#### Core State
```typescript
const [theme, setTheme] = useState<Theme>('system');
const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
```

#### System Preference Detection
```typescript
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
```

#### Theme Application
```typescript
const updateActualTheme = (newTheme: Theme) => {
  const resolvedTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
  setActualTheme(resolvedTheme);
  
  // Apply theme class to document
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(resolvedTheme);
};
```

### Theme Persistence

#### Save Theme Preference
```typescript
useEffect(() => {
  localStorage.setItem('fleek-theme', theme);
}, [theme]);
```

#### Load Saved Theme
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('fleek-theme') as Theme;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    setTheme(savedTheme);
  }
}, []);
```

### System Preference Monitoring

```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    if (theme === 'system') {
      updateActualTheme('system');
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, [theme]);
```

**Features**:
- ✅ **Real-time updates**: Responds to system theme changes
- ✅ **Conditional updates**: Only updates when theme is set to 'system'
- ✅ **Memory efficient**: Proper cleanup of event listeners

### Context Usage Patterns

#### Hook Integration
```typescript
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

#### Component Usage
```typescript
const { theme, setTheme, actualTheme } = useTheme();

// Theme switching
const handleThemeChange = (newTheme: Theme) => {
  setTheme(newTheme);
};

// Conditional styling based on actual theme
const iconColor = actualTheme === 'dark' ? 'text-white' : 'text-black';
```

## 🏗️ Provider Architecture

### Context Provider Hierarchy

```typescript
// In root.tsx
export default function App() {
  return (
    <Document>
      <ThemeProvider>
        <TimerProvider>
          <Layout>
            <Outlet />
          </Layout>
        </TimerProvider>
      </ThemeProvider>
    </Document>
  );
}
```

**Provider Order Rationale**:
1. **ThemeProvider** (outermost): Affects entire application styling
2. **TimerProvider**: Provides timer functionality to all components
3. **Layout**: Common layout wrapper
4. **Outlet**: Route-specific content

### Provider Implementation

#### TimerProvider
```typescript
export function TimerProvider({ children }: { children: React.ReactNode }) {
  // State management...
  // Effects for persistence and updates...
  // Timer operation functions...

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
        totalActiveTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
```

#### ThemeProvider
```typescript
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Theme state management...
  // System preference detection...
  // Theme persistence...

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## 🔄 Cross-Component Communication

### Timer State Synchronization

Components access shared timer state through the context:

```typescript
// TimerCard.tsx
const { getActiveTimer } = useTimer();
const activeTimer = getActiveTimer(timer.id);

// TimerTimesheetsTab.tsx
const { getActiveTimer, stopTimer } = useTimer();
const activeTimer = getActiveTimer(timer.id);

// ActiveTimersSummary.tsx
const { totalActiveTime } = useTimer();
```

**Benefits**:
- ✅ **Consistent state**: All components see the same timer data
- ✅ **Automatic updates**: Changes propagate immediately
- ✅ **No prop drilling**: Direct access from any component

### Theme Coordination

Theme state is synchronized across all UI components:

```typescript
// Header.tsx
const { actualTheme } = useTheme();
const iconColor = actualTheme === 'dark' ? 'text-white' : 'text-gray-900';

// ThemeToggle.tsx
const { theme, setTheme } = useTheme();
const handleToggle = () => setTheme(theme === 'light' ? 'dark' : 'light');
```

## 🚀 Performance Considerations

### Optimization Strategies

#### Selective Updates
```typescript
// Only update when actual changes occur
const { updatedTimers, hasUpdates } = updateElapsedTimes(prev);
if (hasUpdates) {
  setLastUpdateTime(Date.now());
  return updatedTimers;
}
return prev; // Prevents unnecessary re-renders
```

#### Memoization Opportunities
```typescript
// Future optimization: Memoize expensive calculations
const totalActiveTime = useMemo(() => 
  calculateTotalActiveTime(activeTimers), 
  [activeTimers]
);
```

#### Context Splitting
The app uses separate contexts for different concerns:
- **TimerContext**: Heavy, frequently updating timer state
- **ThemeContext**: Light, infrequently changing theme state

This prevents theme changes from triggering timer re-renders and vice versa.

### Memory Management

#### Effect Cleanup
```typescript
useEffect(() => {
  const interval = setInterval(/* ... */);
  return () => clearInterval(interval); // Prevents memory leaks
}, []);
```

#### Event Listener Cleanup
```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => { /* ... */ };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, [theme]);
```

## 🧪 Testing Considerations

### Context Testing Strategies

#### Provider Wrappers
```typescript
const TimerProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <TimerProvider>{children}</TimerProvider>
);

// In tests
render(<ComponentUnderTest />, { wrapper: TimerProviderWrapper });
```

#### Mock Contexts
```typescript
const mockTimerContext = {
  activeTimers: [],
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
  // ... other methods
};

jest.mock('../context/TimerContext', () => ({
  useTimer: () => mockTimerContext,
}));
```

### Unit Testing Hooks

```typescript
// Testing custom hooks
import { renderHook } from '@testing-library/react';
import { useTimer } from '../hooks/useTimer';

test('useTimer hook returns timer context', () => {
  const { result } = renderHook(() => useTimer(), {
    wrapper: TimerProviderWrapper,
  });
  
  expect(result.current.activeTimers).toEqual([]);
  expect(typeof result.current.startTimer).toBe('function');
});
```

## 📋 Best Practices

### Context Design Principles

1. **Single Responsibility**: Each context manages one domain (timers vs themes)
2. **Minimal API**: Only expose what components actually need
3. **Error Boundaries**: Throw errors when context is used outside provider
4. **Performance Awareness**: Avoid unnecessary re-renders through selective updates

### Usage Guidelines

#### Do's ✅
- Use contexts for truly global state
- Keep context values stable when possible
- Implement proper error handling
- Clean up effects and event listeners
- Use custom hooks for context access

#### Don'ts ❌
- Don't use context for all state (use local state when appropriate)
- Don't put rarely-changing and frequently-changing state in same context
- Don't forget to handle loading/error states
- Don't create circular dependencies between contexts

## 🚀 Future Enhancements

### Potential Improvements

1. **Context Persistence**: Save/restore context state on app reload
2. **Context Debugging**: Development tools for context state inspection
3. **Performance Monitoring**: Track context update frequency and performance
4. **Type Safety**: Enhanced TypeScript integration
5. **Testing Utilities**: Improved testing helpers and mock providers

### Scalability Considerations

- **Multiple Timer Contexts**: Separate contexts for different timer categories
- **Middleware Pattern**: Add middleware for logging, debugging, analytics
- **State Machines**: Use state machines for complex timer state management
- **Optimistic Updates**: Immediate UI updates with rollback capability

## 📊 Context State Flow

### Timer State Flow
```
User Action → Context Method → State Update → Effect Trigger → Persistence → UI Update
```

### Theme State Flow
```
User/System → Theme Change → Context Update → CSS Class Applied → UI Re-render
```

This context architecture provides a robust, scalable foundation for state management while maintaining excellent performance and developer experience. 