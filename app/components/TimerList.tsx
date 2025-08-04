import TimerCard from './TimerCard';
import CreateTimerButton from './CreateTimerButton';
import { useTimer } from '../hooks/useTimer';
import { getTimers } from '../utils/storage';
import type TimerData from '../interfaces/TimerData';

interface TimerListProps {
  savedTimers: TimerData[];
}

export default function TimerList({
  savedTimers,
}: TimerListProps) {
  const { 
    activeTimers, 
  } = useTimer();

  // Group timers: active first, then saved
  const activeTimerIds = new Set(activeTimers.map(t => t.id));
  const inactiveTimers = savedTimers.filter(timer => !activeTimerIds.has(timer.id));
  const timerCount = savedTimers.length;

  // Listen for timer stop events to refresh saved timers
  // This could be improved with a proper event system or context update callback

  return (
    <div className="space-y-3">
      {timerCount === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-white/70 text-lg font-medium mb-2">No timers yet</h3>
          <p className="text-white/50 text-sm mb-6">Create your first timer to start tracking time</p>
          <CreateTimerButton />
        </div>
      ) : (
        <>
          {/* Active timers */}
          {activeTimers.map(activeTimer => (
            <TimerCard
              key={activeTimer.id}
              timer={activeTimer.timerData}
              activeElapsedTime={activeTimer.elapsedTime}
            />
          ))}

          {/* Inactive timers */}
          {inactiveTimers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
            />
          ))}
        </>
      )}
    </div>
  );
} 