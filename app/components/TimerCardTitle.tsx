import type TimerData from '../interfaces/TimerData';
import type { TaskData } from '../utils/projects';

interface TimerCardTitleProps {
  timer: TimerData;
  task?: TaskData;
}

export default function TimerCardTitle({ timer, task }: TimerCardTitleProps) {
  return (
    <div className="flex items-center space-x-3">
      {timer.isFavorite ? (
        // Filled star for favorites
        <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ) : (
        // Outlined star for non-favorites
        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )}
      <h3 className="text-white font-semibold text-lg">
        {timer.description || task?.label || 'Untitled Timer'}
      </h3>
    </div>
  );
} 