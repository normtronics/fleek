interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export default function EditButton({ onClick, className = '' }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors ${className}`}
      aria-label="Edit"
    >
      <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  );
} 