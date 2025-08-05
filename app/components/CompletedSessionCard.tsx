import type { CompletedTimerSession } from '../interfaces/TimerData';
import formatDuration from '../utils/timer/formatDuration';
import { formatDate, formatTime } from '../utils/dateTime';
import { CheckIcon } from './icons';
import SessionDescription from './CompletedSessionDescription';

interface CompletedSessionCardProps {
  session: CompletedTimerSession;
}

export default function CompletedSessionCard({ session }: CompletedSessionCardProps) {
  const handleEditDescription = (sessionId: string) => {
    // TODO: Implement description editing functionality
    console.log('Edit description clicked for session:', sessionId);
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-surface-secondary border border-border-primary flex items-center justify-center">
            <CheckIcon className="w-3 h-3 text-text-primary" />
          </div>
          <div>
            <p className="text-white/60 text-sm">
              {formatDate(session.startTime).split(',')[0]}
            </p>
            <p className="text-white font-semibold">
              {formatDate(session.startTime).split(',')[1]?.trim()}
            </p>
            <p className="text-white/60 text-xs">
              Start Time {formatTime(session.startTime)}
            </p>
          </div>
        </div>
        <div className="text-white/60 bg-white/10 px-3 py-1 rounded-lg text-sm">
          {formatDuration(session.totalTime)}
        </div>
      </div>
      
      <SessionDescription 
        description={session.timerData.description}
        sessionId={session.id}
        onEdit={handleEditDescription}
      />
    </div>
  );
} 