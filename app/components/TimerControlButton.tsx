import { useTimer } from '../hooks/useTimer';
import type TimerData from '../interfaces/TimerData';

interface TimerControlButtonProps {
  timer: TimerData;
  className?: string;
}

export default function TimerControlButton({
  timer,
  className = ""
}: TimerControlButtonProps) {
  const { 
    getActiveTimer, 
    startTimer, 
    pauseTimer, 
    resumeTimer 
  } = useTimer();

  const activeTimer = getActiveTimer(timer.id);
  const isActive = !!activeTimer;
  const isPaused = activeTimer?.isPaused || false;
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive) {
      startTimer(timer);
    } else if (isPaused) {
      resumeTimer(timer.id);
    } else {
      pauseTimer(timer.id);
    }
  };

  const getTitle = () => {
    if (!isActive) return "Start";
    return isPaused ? "Resume" : "Pause";
  };

  const getIcon = () => {
    if (!isActive || isPaused) {
      // Play icon
      return (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    } else {
      // Pause icon
      return (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className}`}
      title={getTitle()}
    >
      {getIcon()}
    </button>
  );
} 