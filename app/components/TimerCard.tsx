import { Link } from "react-router";
import { getProjectById, getTaskById } from "../utils/projects";
import { useTimer } from "../context/TimerContext";
import formatDuration from "../utils/timer/formatDuration";
import type TimerData from "../interfaces/TimerData";

interface TimerCardProps {
  timer: TimerData;
  isActive?: boolean;
  activeElapsedTime?: number;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

function TimerCard({ 
  timer, 
  isActive = false, 
  activeElapsedTime = 0,
  onStart, 
  onStop, 
  onPause, 
  onResume 
}: TimerCardProps) {
  const project = getProjectById(timer.project);
  const task = getTaskById(timer.task);
  const { getActiveTimer } = useTimer();
  
  const activeTimer = getActiveTimer(timer.id);
  const isPaused = activeTimer?.isPaused || false;
  const isRunning = activeTimer?.isRunning && !activeTimer.isPaused;

  const displayTime = isActive ? formatDuration(activeElapsedTime) : '00:00';

  return (
    <Link 
      to={`/timer/${timer.id}`}
      className="block p-6 rounded-lg border-2 border-dashed border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="border-l-4 border-yellow-400 pl-4 space-y-3">
            {/* Title with star */}
            <div className="flex items-center space-x-3">
              {timer.isFavorite && (
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
              <h3 className="text-white font-semibold text-lg">
                {timer.description || task?.label || 'Untitled Timer'}
              </h3>
            </div>
            
            {/* Project info with briefcase icon */}
            <div className="flex items-center space-x-3 text-white/80">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2z" />
              </svg>
              <span>{project?.label || 'Unknown Project'} - {task?.label || 'Unknown Task'}</span>
            </div>
            
            {/* Deadline with clock icon */}
            <div className="flex items-center space-x-3 text-white/60 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Deadline {timer.createdAt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        {/* Timer display and controls - dotted border box */}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-4 flex items-center space-x-4">
          <div className="text-white font-mono text-2xl font-bold">
            {displayTime}
          </div>
          
          <div className="flex items-center space-x-2">
            {isActive && (
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
            )}
            
            {isActive ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isPaused ? onResume() : onPause();
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStart();
                }}
                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                title="Start"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TimerCard;
