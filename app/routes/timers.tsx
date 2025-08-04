import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/timers';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useTimer } from '../hooks/useTimer';
import { getTimers } from '../utils/storage';
import type TimerData from '../interfaces/TimerData';
import TimerCard from '../components/TimerCard';
import formatTotalTime from '../utils/timer/formatTotalTime';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Timers - Fleek' },
    { name: 'description', content: 'Manage your timers and time tracking' },
  ];
}


export default function Timers() {
  const [savedTimers, setSavedTimers] = useState<TimerData[]>([]);
  const { 
    activeTimers, 
    startTimer, 
    stopTimer, 
    pauseTimer, 
    resumeTimer,
    hasActiveTimers,
    totalActiveTime 
  } = useTimer();

  useEffect(() => {
    setSavedTimers(getTimers());
  }, []);

  const handleStartTimer = (timer: TimerData) => {
    startTimer(timer);
  };

  const handleStopTimer = (timerId: string) => {
    stopTimer(timerId);
    // Refresh saved timers to reflect any changes
    setSavedTimers(getTimers());
  };

  const handlePauseTimer = (timerId: string) => {
    pauseTimer(timerId);
  };

  const handleResumeTimer = (timerId: string) => {
    resumeTimer(timerId);
  };

  // Group timers: active first, then saved
  const activeTimerIds = new Set(activeTimers.map(t => t.id));
  const inactiveTimers = savedTimers.filter(timer => !activeTimerIds.has(timer.id));

  const timerCount = savedTimers.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Timesheets"
        rightElement={
          <div className="flex items-center space-x-3">
            <Link to="/create-timer">
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </Link>
          </div>
        }
      />
      
      <main className="flex-1 p-4 pb-safe">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active timers summary */}
          {hasActiveTimers && (
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
          )}

          {/* Timer list */}
          <div className="space-y-3">
            {timerCount === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-white/70 text-lg font-medium mb-2">No timers yet</h3>
                <p className="text-white/50 text-sm mb-6">Create your first timer to start tracking time</p>
                <Link to="/create-timer">
                  <Button variant="primary">
                    Create Timer
                  </Button>
                </Link>
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

        </div>
      </main>
    </div>
  );
}
