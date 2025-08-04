import { Link } from "react-router";
import { getProjectById, getTaskById } from "../utils/projects";
import { useTimer } from "../context/TimerContext";
import formatDuration from "../utils/timer/formatDuration";
import type TimerData from "../interfaces/TimerData";
import TimerCardTitle from "./TimerCardTitle";
import TimerProjectInfo from "./TimerProjectInfo";
import TimerDeadline from "./TimerDeadline";
import TimerControlButton from "./TimerControlButton";

interface TimerCardProps {
  timer: TimerData;
  isActive?: boolean;
  activeElapsedTime?: number;
}

function TimerCard({ 
  timer, 
  activeElapsedTime = 0
}: TimerCardProps) {
  const project = getProjectById(timer.project);
  const task = getTaskById(timer.task);
  const { getActiveTimer } = useTimer();
  const activeTimer = getActiveTimer(timer.id);

  const displayTime = formatDuration(activeElapsedTime);

  return (
    <Link 
      to={`/timer/${timer.id}`}
      className="block p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-blue-500/20 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="border-l-2 border-yellow-400 pl-4 space-y-3">
            {/* Title with star */}
            <TimerCardTitle timer={timer} task={task} />
            
            {/* Project info with briefcase icon */}
            <TimerProjectInfo project={project} task={task} />
            
            {/* Deadline with clock icon */}
            <TimerDeadline timer={timer} />
          </div>
        </div>
        
        {/* Timer display and controls - dotted border box */}
        <div className="rounded-4xl p-4 flex items-center gap-2 bg-white">
          <div className="text-black text-body-medium font-inter min-w-14 text-center font-medium">
            {displayTime}
          </div>
          
          <div className="flex items-center">
            <TimerControlButton timer={timer} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TimerCard;
