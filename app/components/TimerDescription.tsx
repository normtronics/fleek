import { PencilIcon } from './icons';

interface TimerDescriptionProps {
  description: string;
  onEdit?: () => void;
}

export default function TimerDescription({ description, onEdit }: TimerDescriptionProps) {
  return (
    <div className="mt-6 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white/60 text-sm">Description</h4>
        {onEdit && (
          <button onClick={onEdit} className="p-1 rounded hover:bg-white/10">
            <PencilIcon className="w-4 h-4 text-white/60" />
          </button>
        )}
      </div>
      <p className="text-white text-sm mt-2">
        {description}
      </p>
    </div>
  );
} 