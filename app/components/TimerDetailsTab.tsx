import type TimerData from '../interfaces/TimerData';
import { getProjectById, getTaskById } from '../utils/projects';

interface TimerDetailsTabProps {
  timer: TimerData;
}

export default function TimerDetailsTab({ timer }: TimerDetailsTabProps) {
  const project = getProjectById(timer.project);
  const task = getTaskById(timer.task);

  return (
    <>
      {/* Project Information */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="border-l-4 border-orange-400 pl-4 mb-6">
          <h3 className="text-white/60 text-sm font-medium mb-1">Project</h3>
          <h2 className="text-white text-2xl font-bold">
            {project?.label || 'Apexive: Content Planning'}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-white/60 text-sm font-medium mb-2">Deadline</h4>
            <p className="text-white text-lg font-semibold">
              10/11/2023
            </p>
          </div>

          <div>
            <h4 className="text-white/60 text-sm font-medium mb-2">Assigned to</h4>
            <p className="text-white text-lg font-semibold">
              Ivan Zhuikov
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white/60 text-sm font-medium mb-3">Description</h3>
        <p className="text-white text-base leading-relaxed">
          {timer.description || 'As a user, I would like to be able to buy a subscription, this would allow me to get a discount on the products and on the second stage of diagnosis'}
        </p>
      </div>
    </>
  );
} 