import { Link } from "react-router";
import { getProjectById, getTaskById } from "../utils/projects";
import { useTimer } from "../context/TimerContext";
import formatDuration from "../utils/timer/formatDuration";
import type TimerData from "../interfaces/TimerData";
import TimerCardTitle from "./TimerCardTitle";
import TimerProjectInfo from "./TimerProjectInfo";
import TimerDeadline from "./TimerDeadline";

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
      className="block p-6 rounded-lg backdrop-blur-sm bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="border-l-4 border-yellow-400 pl-4 space-y-3">
            {/* Title with star */}
            <TimerCardTitle timer={timer} task={task} />
            
            {/* Project info with briefcase icon */}
            <TimerProjectInfo project={project} task={task} />
            
            {/* Deadline with clock icon */}
            <TimerDeadline timer={timer} />
          </div>
        </div>
        
        {/* Timer display and controls - dotted border box */}
        <div className="bg-white rounded-4xl p-2 flex items-center">
          <div className="text-black font-mono text-sm font-bold">
            {displayTime}
          </div>
          
          <div className="flex items-center space-x-2"> 
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
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
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
                className="p-2 rounded-lg transition-colors"
                title="Start"
              >
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
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
