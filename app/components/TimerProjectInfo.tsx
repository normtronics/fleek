import type { ProjectData, TaskData } from '../utils/projects';
import { BriefcaseIcon } from './icons';

interface TimerProjectInfoProps {
  project?: ProjectData;
  task?: TaskData;
}

export default function TimerProjectInfo({ project, task }: TimerProjectInfoProps) {
  return (
    <div className="flex items-center space-x-3 text-white/80">
      <BriefcaseIcon className="w-4 h-4 flex-shrink-0" />
      <span>{project?.label || 'Unknown Project'} - {task?.label || 'Unknown Task'}</span>
    </div>
  );
} 