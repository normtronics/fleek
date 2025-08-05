import { StopIcon } from './icons';

interface StopButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function StopButton({ 
  onClick, 
  disabled = false, 
  className = "" 
}: StopButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-full bg-surface-secondary border border-border-primary hover:bg-surface-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Stop"
    >
      <StopIcon className="w-6 h-6 text-text-primary" />
    </button>
  );
} 