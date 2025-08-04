import TimerCard from './TimerCard';
import CreateTimerButton from './CreateTimerButton';
import { useTimer } from '../hooks/useTimer';
import { getTimers } from '../utils/storage';
import type TimerData from '../interfaces/TimerData';

interface TimerListProps {
  savedTimers: TimerData[];
  onTimersUpdate: () => void;
}

export default function TimerList({
  savedTimers,
  onTimersUpdate,
}: TimerListProps) {
  const { 
    activeTimers, 
    startTimer, 
    stopTimer, 
    pauseTimer, 
    resumeTimer 
  } = useTimer();

  // Group timers: active first, then saved
  const activeTimerIds = new Set(activeTimers.map(t => t.id));
  const inactiveTimers = savedTimers.filter(timer => !activeTimerIds.has(timer.id));
  const timerCount = savedTimers.length;

  const handleStartTimer = (timer: TimerData) => {
    startTimer(timer);
  };

  const handleStopTimer = (timerId: string) => {
    stopTimer(timerId);
    // Refresh saved timers to reflect any changes
    onTimersUpdate();
  };

  const handlePauseTimer = (timerId: string) => {
    pauseTimer(timerId);
  };

  const handleResumeTimer = (timerId: string) => {
    resumeTimer(timerId);
  };

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
              onStart={() => handleStartTimer(activeTimer.timerData)}
              onStop={() => handleStopTimer(activeTimer.id)}
              onPause={() => handlePauseTimer(activeTimer.id)}
              onResume={() => handleResumeTimer(activeTimer.id)}
            />
          ))}

          {/* Inactive timers */}
          {inactiveTimers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
              isActive={false}
              onStart={() => handleStartTimer(timer)}
              onStop={() => handleStopTimer(timer.id)}
              onPause={() => handlePauseTimer(timer.id)}
              onResume={() => handleResumeTimer(timer.id)}
            />
          ))}
        </>
      )}
    </div>
  );
} 