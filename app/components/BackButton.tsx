import { BackIcon } from './icons';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export default function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl ${className}`}
      aria-label="Go back"
    >
      <BackIcon className="w-10 h-10 text-text-primary" />
    </button>
  );
} 