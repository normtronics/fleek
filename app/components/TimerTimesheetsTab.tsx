import type TimerData from '../interfaces/TimerData';
import { Button } from './Button';
import { useTimer, useTimerDisplay } from '../hooks/useTimer';

interface TimerTimesheetsTabProps {
  timer: TimerData;
}

export default function TimerTimesheetsTab({ timer }: TimerTimesheetsTabProps) {
  const { 
    getActiveTimer, 
    startTimer, 
    stopTimer, 
    pauseTimer, 
    resumeTimer 
  } = useTimer();
  
  const activeTimer = getActiveTimer(timer.id);
  const isActive = !!activeTimer;
  const isPaused = activeTimer?.isPaused || false;
  const isRunning = activeTimer?.isRunning && !activeTimer.isPaused || false;
  
  // Only get timer display data if there's an active timer
  const timerDisplay = activeTimer ? useTimerDisplay(activeTimer) : null;
  const displayTime = timerDisplay?.formattedTime || '00:00';

  const handleStartTimer = () => {
    startTimer(timer);
  };

  const handleStopTimer = () => {
    stopTimer(timer.id);
  };

  const handlePauseTimer = () => {
    pauseTimer(timer.id);
  };

  const handleResumeTimer = () => {
    resumeTimer(timer.id);
  };
  return (
    <>
      {/* Current Timer Session */}
      {isActive && (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/60 text-sm">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </h3>
                <p className="text-white text-xl font-bold">
                  {new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
                <p className="text-white/60 text-sm">Start Time 10:00</p>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-white font-mono text-5xl font-bold">
                  {displayTime}
                </div>
                
                                 <div className="flex items-center space-x-4">
                   <button
                     onClick={handleStopTimer}
                     className="p-4 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                     title="Stop"
                   >
                     <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M6 6h12v12H6z" />
                     </svg>
                   </button>
                   
                   <button
                     onClick={isPaused ? handleResumeTimer : handlePauseTimer}
                     className="p-4 rounded-full bg-white hover:bg-white/90 transition-colors"
                     title={isPaused ? 'Resume' : 'Pause'}
                   >
                     {isPaused ? (
                       <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M8 5v14l11-7z" />
                       </svg>
                     ) : (
                       <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                       </svg>
                     )}
                   </button>
                 </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white/60 text-sm">Description</h4>
                <button className="p-1 rounded hover:bg-white/10">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-white text-sm mt-2">
                {timer.description || 'Sync with Client, communicate, work on the new design with designer, new tasks preparati...'}
              </p>
              <button className="text-blue-400 text-sm mt-1 hover:text-blue-300">Read More</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Start Timer Button if not active */}
      {!isActive && (
                 <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
           <Button
             variant="primary"
             onClick={handleStartTimer}
             className="flex items-center space-x-2 mx-auto"
           >
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
               <path d="M8 5v14l11-7z" />
             </svg>
             <span>Start Timer</span>
           </Button>
         </div>
      )}
      
      {/* Completed Records */}
      <div>
        <h3 className="text-white/60 text-sm font-medium mb-4">Completed Records</h3>
        <div className="space-y-3">
          {/* Mock completed records */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Sunday</p>
                  <p className="text-white font-semibold">16.06.2023</p>
                  <p className="text-white/60 text-xs">Start Time 10:00</p>
                </div>
              </div>
              <div className="text-white/60 bg-white/10 px-3 py-1 rounded-lg text-sm">
                08:00
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Sunday</p>
                  <p className="text-white font-semibold">16.06.2023</p>
                  <p className="text-white/60 text-xs">Start Time 10:00</p>
                </div>
              </div>
              <div className="text-white/60 bg-white/10 px-3 py-1 rounded-lg text-sm">
                08:00
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white/60 text-sm">Description</h4>
            <button className="p-1 rounded hover:bg-white/10">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <p className="text-white text-sm mt-2">
            {timer.description || 'As a user, I would like to be able to buy a subscription, this would allow me to get a discount on the products and on the second stage of diagnosis'}
          </p>
        </div>
      </div>
    </>
  );
} 