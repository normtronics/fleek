import { useState, useEffect } from 'react';
import type { Route } from './+types/timers';
import { Header } from '../components/Header';
import CreateTimerButton from '../components/CreateTimerButton';
import { getTimers } from '../utils/storage';
import type TimerData from '../interfaces/TimerData';
import TimerList from '../components/TimerList';
import ActiveTimersSummary from '../components/ActiveTimersSummary';
import EmptyTimersState from '../components/EmptyTimersState';

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

  // Show empty state when no timers exist
  if (savedTimers.length === 0) {
    return <EmptyTimersState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        centerElement={
          <h1 className="text-headline-large font-inter font-medium text-text-primary">
            Timesheets
          </h1>
        }
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
          <TimerList savedTimers={savedTimers} />
        </div>
      </main>
    </div>
  );
}
