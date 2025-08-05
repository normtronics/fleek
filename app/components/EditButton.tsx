import { PencilIcon } from './icons';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export default function EditButton({ onClick, className = '' }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 transition-colors ${className}`}
      aria-label="Edit"
    >
      <PencilIcon className="w-7 h-7 text-text-primary" />
    </button>
  );
} 