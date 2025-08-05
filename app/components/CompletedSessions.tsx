import type { CompletedTimerSession } from '../interfaces/TimerData';
import type TimerData from '../interfaces/TimerData';
import TimerDescription from './TimerDescription';
import CompletedSessionCard from './CompletedSessionCard';

interface CompletedSessionsProps {
  sessions: CompletedTimerSession[];
  timer: TimerData;
}

export default function CompletedSessions({ sessions, timer }: CompletedSessionsProps) {
  const handleEditDescription = () => {
    console.log('Edit description clicked for timer:', timer.id);
  };

  return (
    <div>
      <h3 className="text-white/60 text-sm font-medium mb-4">Completed Records</h3>
      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <CompletedSessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
          <p className="text-white/60 text-sm">No completed sessions yet</p>
        </div>
      )}
      
      {/* Timer Description */}
      <TimerDescription description={timer.description} onEdit={handleEditDescription} />
    </div>
  );
} 