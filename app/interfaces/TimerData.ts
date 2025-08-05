export default interface TimerData {
  project: string;
  task: string;
  description: string;
  isFavorite: boolean;
  createdAt: Date;
  id: string;
}

export interface CompletedTimerSession {
  id: string;
  timerId: string;
  timerData: TimerData;
  startTime: Date;
  endTime: Date;
  totalTime: number; // in seconds
  completedAt: Date;
}