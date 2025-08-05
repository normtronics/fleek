import { PlayIcon } from './icons';

interface StartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function StartButton({ 
  onClick, 
  disabled = false, 
  className = "" 
}: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-full bg-white hover:bg-primary-70 active:bg-primary-80 border border-primary-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Start"
    >
      <PlayIcon className="w-6 h-6 text-black" />
    </button>
  );
} 