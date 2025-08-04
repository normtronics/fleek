import TimerCard from './TimerCard';
import CreateTimerButton from './CreateTimerButton';
import type TimerData from '../interfaces/TimerData';
import type { ActiveTimer } from '../context/TimerContext';

interface TimerListProps {
  savedTimers: TimerData[];
  activeTimers: ActiveTimer[];
  onStartTimer: (timer: TimerData) => void;
  onStopTimer: (timerId: string) => void;
  onPauseTimer: (timerId: string) => void;
  onResumeTimer: (timerId: string) => void;
}

export default function TimerList({
  savedTimers,
  activeTimers,
  onStartTimer,
  onStopTimer,
  onPauseTimer,
  onResumeTimer,
}: TimerListProps) {
  // Group timers: active first, then saved
  const activeTimerIds = new Set(activeTimers.map(t => t.id));
  const inactiveTimers = savedTimers.filter(timer => !activeTimerIds.has(timer.id));
  const timerCount = savedTimers.length;

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
              isActive={true}
              activeElapsedTime={activeTimer.elapsedTime}
              onStart={() => onStartTimer(activeTimer.timerData)}
              onStop={() => onStopTimer(activeTimer.id)}
              onPause={() => onPauseTimer(activeTimer.id)}
              onResume={() => onResumeTimer(activeTimer.id)}
            />
          ))}

          {/* Inactive timers */}
          {inactiveTimers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
              isActive={false}
              onStart={() => onStartTimer(timer)}
              onStop={() => onStopTimer(timer.id)}
              onPause={() => onPauseTimer(timer.id)}
              onResume={() => onResumeTimer(timer.id)}
            />
          ))}
        </>
      )}
    </div>
  );
} 