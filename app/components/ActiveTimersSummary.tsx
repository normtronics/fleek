import { useTimer } from '../hooks/useTimer';
import formatTotalTime from '../utils/timer/formatTotalTime';

export default function ActiveTimersSummary() {
  const { activeTimers, hasActiveTimers, totalActiveTime } = useTimer();

  if (!hasActiveTimers) {
    return null;
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold">Active Timers</h2>
          <p className="text-white/70 text-sm">
            {activeTimers.length} running • Total time: {formatTotalTime(totalActiveTime)}
          </p>
        </div>
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
} 