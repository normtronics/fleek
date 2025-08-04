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
import BackButton from "../components/BackButton";
import EditButton from "../components/EditButton";

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
  }, [timerId, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    // TODO: Add edit functionality
    console.log('Edit timer:', timer?.id);
  };

  if (!timer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          centerElement={
            <h1 className="text-headline-large font-inter font-medium text-text-primary">
              Timer Not Found
            </h1>
          }
          leftElement={<BackButton onClick={handleGoBack} />}
        />
        <main className="flex-1 p-4">
          <p className="text-text-secondary">Timer not found.</p>
        </main>
      </div>
    );
  }

  const project = getProjectById(timer.project);
  const task = getTaskById(timer.task);
  
  const headerTitle = `${project?.label || 'Unknown Project'} - ${task?.label || 'Unknown Task'}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        centerElement={
          <h1 className="text-headline-large font-inter font-medium text-text-primary">
            {headerTitle}
          </h1>
        }
        leftElement={<BackButton onClick={handleGoBack} />}
        rightElement={<EditButton onClick={handleEdit} />}
      />
      
      <main className="flex-1 p-4 pb-safe">
        <div className="max-w-4xl mx-auto space-y-6">
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {activeTab === TabType.TIMESHEETS && (
            <TimerTimesheetsTab timer={timer} />
          )}
          
          {activeTab === TabType.DETAILS && (
            <TimerDetailsTab timer={timer} />
          )}
        </div>
      </main>
    </div>
  );
}
