import { Link } from 'react-router';
import { Button } from './Button';

interface CreateTimerButtonProps {
  variant?: 'text' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CreateTimerButton({ 
  variant = 'text', 
  size = 'md',
  className = '' 
}: CreateTimerButtonProps) {
  if (variant === 'icon') {
    return (
      <Link to="/create-timer">
        <button className={`p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors ${className}`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </Link>
    );
  }

  return (
    <Link to="/create-timer">
      <Button variant="primary" size={size} className={className}>
        Create Timer
      </Button>
    </Link>
  );
} 