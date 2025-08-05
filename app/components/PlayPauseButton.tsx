import { PlayIcon, PauseIcon } from './icons';

interface PlayPauseButtonProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  className?: string;
}

export default function PlayPauseButton({ 
  isPaused, 
  onPause, 
  onResume, 
  className = "" 
}: PlayPauseButtonProps) {
  const handleClick = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-4 rounded-full bg-white border border-border-primary hover:bg-surface-tertiary transition-colors ${className}`}
      title={isPaused ? 'Resume' : 'Pause'}
    >
      {isPaused ? (
        <PlayIcon className="w-6 h-6 text-black" />
      ) : (
        <PauseIcon className="w-6 h-6 text-black" />
      )}
    </button>
  );
} 