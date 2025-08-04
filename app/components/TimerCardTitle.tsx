import type TimerData from '../interfaces/TimerData';
import type { TaskData } from '../utils/projects';

interface TimerCardTitleProps {
  timer: TimerData;
  task?: TaskData;
}

export default function TimerCardTitle({ timer, task }: TimerCardTitleProps) {
  return (
    <div className="flex items-center space-x-3">
      {timer.isFavorite && (
        <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      <h3 className="text-white font-semibold text-lg">
        {timer.description || task?.label || 'Untitled Timer'}
      </h3>
    </div>
  );
} 