import type { ProjectData, TaskData } from '../utils/projects';

interface TimerProjectInfoProps {
  project?: ProjectData;
  task?: TaskData;
}

export default function TimerProjectInfo({ project, task }: TimerProjectInfoProps) {
  return (
    <div className="flex items-center space-x-3 text-white/80">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2z" />
      </svg>
      <span>{project?.label || 'Unknown Project'} - {task?.label || 'Unknown Task'}</span>
    </div>
  );
} 