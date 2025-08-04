import { useState, useEffect } from 'react';
import type { Route } from './+types/timers';
import { Header } from '../components/Header';
import CreateTimerButton from '../components/CreateTimerButton';
import { getTimers } from '../utils/storage';
import type TimerData from '../interfaces/TimerData';
import TimerList from '../components/TimerList';
import ActiveTimersSummary from '../components/ActiveTimersSummary';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Timers - Fleek' },
    { name: 'description', content: 'Manage your timers and time tracking' },
  ];
}

export default function Timers() {
  const [savedTimers, setSavedTimers] = useState<TimerData[]>([]);

  useEffect(() => {
    setSavedTimers(getTimers());
  }, []);

  const handleTimersUpdate = () => {
    setSavedTimers(getTimers());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Timesheets"
        rightElement={
          <div className="flex items-center space-x-3">
            <CreateTimerButton variant="icon" />
          </div>
        }
      />
      
      <main className="flex-1 p-4 pb-safe">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active timers summary */}
          <ActiveTimersSummary />

          {/* Timer list */}
          <TimerList
            savedTimers={savedTimers}
            onTimersUpdate={handleTimersUpdate}
          />
        </div>
      </main>
    </div>
  );
}
