import { useState } from 'react';

export interface ExpandableSectionProps {
  title: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function ExpandableSection({ 
  title, 
  children, 
  defaultExpanded = false,
  onToggle 
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/5 transition-colors duration-200 text-text-primary"
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-3">
          {children}
        </div>
      </div>
    </div>
  );
} 