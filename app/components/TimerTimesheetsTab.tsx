import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useTimerDisplay } from '../hooks/useTimerDisplay';
import type TimerData from '../interfaces/TimerData';
import type { CompletedTimerSession } from '../interfaces/TimerData';
import { getCompletedSessionsForTimer } from '../utils/storage';
import CompletedSessions from './CompletedSessions';
import StopButton from './StopButton';
import PlayPauseButton from './PlayPauseButton';
import StartButton from './StartButton';
import TimerDescription from './TimerDescription';
import { formatDate, formatTime } from '../utils/dateTime';
import formatFullTime from '../utils/timer/formatFullTime';

interface TimerTimesheetsTabProps {
  timer: TimerData;
}

export default function TimerTimesheetsTab({ timer }: TimerTimesheetsTabProps) {
  const { 
    getActiveTimer, 
    startTimer, 
    stopTimer, 
    pauseTimer, 
    resumeTimer 
  } = useTimer();
  
  const [completedSessions, setCompletedSessions] = useState<CompletedTimerSession[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const stopInProgressRef = useRef(false);
  
  const activeTimer = timer?.id ? getActiveTimer(timer.id) : null;
  const isActive = !!activeTimer;
  const isPaused = activeTimer?.isPaused || false;
  
  // Create a fallback timer for the hook to ensure it's always called
  const timerForDisplay = activeTimer || {
    id: '',
    timerData: timer || { id: '', project: '', task: '', description: '', isFavorite: false, createdAt: new Date() },
    startTime: new Date(),
    isPaused: false,
    isRunning: false,
    elapsedTime: 0,
    pausedTime: 0
  };
  
  // Always call useTimerDisplay to maintain hook order
  const timerDisplay = useTimerDisplay(timerForDisplay);
  
  const displayTime = isActive 
    ? formatFullTime(timerDisplay.hours, timerDisplay.minutes, timerDisplay.seconds)
    : '00:00:00';

  // Load completed sessions for this timer - refresh when timer changes or when refreshTrigger updates
  useEffect(() => {
    if (timer?.id) {
      setCompletedSessions(getCompletedSessionsForTimer(timer.id));
    }
  }, [timer?.id, refreshTrigger]);


  const handleStartTimer = () => {
    if (timer) {
      startTimer(timer);
    }
  };

  const handleStopTimer = () => {
    // Prevent double-clicking or rapid successive calls
    if (stopInProgressRef.current) {
      return;
    }
    
    if (timer?.id) {
      stopInProgressRef.current = true;
      
      stopTimer(timer.id);
      
      // Trigger refresh of completed sessions immediately
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
        stopInProgressRef.current = false;
      }, 100);
    }
  };

  const handlePauseTimer = () => {
    if (timer?.id) {
      pauseTimer(timer.id);
    }
  };

  const handleResumeTimer = () => {
    if (timer?.id) {
      resumeTimer(timer.id);
    }
  };

  const handleEditDescription = () => {
    // TODO: Implement description editing functionality
    console.log('Edit description clicked for timer:', timer.id);
  };

  // Now we can do the early return after all hooks are called
  if (!timer || !timer.id) {
    return null;
  }

  return (
    <>
      <div className="max-w-md mx-auto">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/60 text-sm">
                  {isActive ? (
                    activeTimer && formatDate(activeTimer.startTime).split(',')[0]
                  ) : (
                    'Ready to start'
                  )}
                </h3>
                <p className="text-white text-xl font-bold">
                  {isActive ? (
                    activeTimer && formatDate(activeTimer.startTime).split(',')[1]?.trim()
                  ) : (
                    'Click start to begin timing'
                  )}
                </p>
                <p className="text-white/60 text-sm">
                  {isActive ? (
                    `Start Time ${activeTimer && formatTime(activeTimer.startTime)}`
                  ) : (
                    'Timer is stopped'
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div className="text-white text-display-medium font-bold min-w-[12rem] text-center">
                {isActive ? displayTime : '00:00:00'}
              </div>
              
              <div className="flex items-center space-x-4">
                {!isActive ? (
                  // Show start button when timer is not active
                  <StartButton
                    onClick={handleStartTimer}
                  />
                ) : (
                  // Show stop and pause/resume buttons when timer is active
                  <>
                    <StopButton
                      onClick={handleStopTimer}
                      disabled={stopInProgressRef.current}
                    />
                    
                    <PlayPauseButton
                      isPaused={isPaused}
                      onPause={handlePauseTimer}
                      onResume={handleResumeTimer}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          
          <TimerDescription 
            description={timer.description} 
            onEdit={handleEditDescription}
          />
        </div>
      </div>

      {/* Completed Records */}
      <CompletedSessions sessions={completedSessions} timer={timer} />
    </>
  );
} 