import type TimerData from '../interfaces/TimerData';

interface TimerDeadlineProps {
  timer: TimerData;
}

export default function TimerDeadline({ timer }: TimerDeadlineProps) {
  return (
    <div className="flex items-center space-x-3 text-white/60 text-sm">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Deadline {timer.createdAt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
    </div>
  );
} 