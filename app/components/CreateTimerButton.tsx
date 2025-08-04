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
        <Button variant="secondary" size={size} className={`p-3 ${className}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/create-timer">
      <Button variant="secondary" size={size} className={className}>
        Create Timer
      </Button>
    </Link>
  );
} 