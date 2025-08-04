import { useTimer } from '../hooks/useTimer';
import { getTimers } from '../utils/storage';
import { useState, useEffect } from 'react';

export default function ActiveTimersSummary() {
  const { activeTimers, hasActiveTimers } = useTimer();
  const [totalTimers, setTotalTimers] = useState(0);

  useEffect(() => {
    setTotalTimers(getTimers().length);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/70 text-sm">
          You have {totalTimers} Timer{totalTimers !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
} 