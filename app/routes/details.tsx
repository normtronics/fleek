import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Route } from './+types/details';
import { Header } from '../components/Header';
import { getTimers } from '../utils/storage';
import type TimerData from '../interfaces/TimerData';
import { getProjectById, getTaskById } from '../utils/projects';
import TimerDetailsTab from '../components/TimerDetailsTab';
import TimerTimesheetsTab from '../components/TimerTimesheetsTab';
import TabNavigation, { TabType } from '../components/TabNavigation';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Timer Details - Fleek' },
    { name: 'description', content: 'View detailed information about your timer' },
  ];
}

export default function TimerDetails() {
  const { timerId } = useParams();
  const navigate = useNavigate();
  const [timer, setTimer] = useState<TimerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.TIMESHEETS);
  


  const tabs = [
    { id: TabType.TIMESHEETS, label: 'Timesheets' },
    { id: TabType.DETAILS, label: 'Details' }
  ];

  useEffect(() => {
    if (!timerId) {
      navigate('/timers');
      return;
    }

    // Load the timer data
    const allTimers = getTimers();
    const foundTimer = allTimers.find(t => t.id === timerId);
    
    if (!foundTimer) {
      navigate('/timers');
      return;
    }

    setTimer(foundTimer);
    setLoading(false);
  }, [timerId, navigate]);

  if (loading || !timer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const project = getProjectById(timer.project);
  const task = getTaskById(timer.task);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title={`Get to know ${project?.label || 'Project'} - ${task?.label || 'Task'}`}
        rightElement={
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        }
      />
    
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      
      <main className="flex-1 p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          {activeTab === TabType.TIMESHEETS ? (
            <TimerTimesheetsTab timer={timer} />
          ) : (
            <TimerDetailsTab timer={timer} />
          )}
        </div>
      </main>
    </div>
  );
}
