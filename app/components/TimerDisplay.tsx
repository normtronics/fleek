import { useTimer, useTimerDisplay } from '../hooks/useTimer';
import { Button } from './Button';
import type { ActiveTimer } from '../context/TimerContext';

interface TimerDisplayProps {
  timer: ActiveTimer;
  compact?: boolean;
  showControls?: boolean;
}

export function TimerDisplay({ timer, compact = false, showControls = true }: TimerDisplayProps) {
  const { stopTimer, pauseTimer, resumeTimer } = useTimer();
  const { formattedTime, projectName, taskName, description, isRunning, isPaused, isFavorite } = useTimerDisplay(timer);

  const handleStop = () => {
    stopTimer(timer.id);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTimer(timer.id);
    } else {
      pauseTimer(timer.id);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
          <div>
            <div className="text-white font-mono text-lg font-bold">{formattedTime}</div>
            <div className="text-white/70 text-sm">{projectName} • {taskName}</div>
          </div>
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePauseResume}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleStop}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              title="Stop"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
          <div>
            <h3 className="text-white font-semibold text-lg">{projectName}</h3>
            <p className="text-white/70">{taskName}</p>
          </div>
        </div>
        
        {isFavorite && (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </div>

      <div className="mb-4">
        <div className="text-white font-mono text-3xl font-bold mb-2">{formattedTime}</div>
        <div className="text-white/80 text-sm">
          Status: <span className={`font-medium ${isRunning ? 'text-green-400' : 'text-yellow-400'}`}>
            {isRunning ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      {description && (
        <div className="mb-4">
          <p className="text-white/70 text-sm">{description}</p>
        </div>
      )}

      {showControls && (
        <div className="flex space-x-3">
          <Button
            variant={isPaused ? 'primary' : 'secondary'}
            size="sm"
            onClick={handlePauseResume}
            className="flex items-center space-x-2"
          >
            {isPaused ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Resume</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span>Pause</span>
              </>
            )}
          </Button>
          
          <Button
            variant="tertiary"
            size="sm"
            onClick={handleStop}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
            <span>Stop</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function ActiveTimersOverview() {
  const { activeTimers, hasActiveTimers, totalActiveTime } = useTimer();

  if (!hasActiveTimers) {
    return null;
  }

  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Active Timers</h2>
        <div className="text-white/70 text-sm">
          Total: {formatTotalTime(totalActiveTime)}
        </div>
      </div>
      
      <div className="space-y-3">
        {activeTimers
          .filter(timer => timer.isRunning)
          .map(timer => (
            <TimerDisplay key={timer.id} timer={timer} compact />
          ))}
      </div>
    </div>
  );
} 