import type TimerData from '../interfaces/TimerData';
import { useTimer } from '../hooks/useTimer';
import { PlayIcon, PauseIcon } from './icons';

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
      return <PlayIcon className="w-5 h-5 text-black" />;
    } else {
      return <PauseIcon className="w-5 h-5 text-black" />;
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