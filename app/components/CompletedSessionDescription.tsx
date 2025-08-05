import { useState } from 'react';
import { PencilIcon } from './icons';

interface SessionDescriptionProps {
  description: string;
  sessionId: string;
  onEdit?: (sessionId: string) => void;
}

export default function SessionDescription({ 
  description, 
  sessionId, 
  onEdit 
}: SessionDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const handleEditDescription = () => {
    if (onEdit) {
      onEdit(sessionId);
    } else {
      // TODO: Implement description editing functionality
      console.log('Edit description clicked for session:', sessionId);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const needsTruncation = description && description.length > 100;
  const displayDescription = needsTruncation 
    ? (isExpanded ? description : truncateDescription(description))
    : description;

  if (!description) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white/60 text-xs font-medium">Description</h4>
        <button 
          onClick={handleEditDescription}
          className="p-1 rounded hover:bg-white/10"
        >
          <PencilIcon className="w-3 h-3 text-white/60" />
        </button>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">
        {displayDescription}
      </p>
      {needsTruncation && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-primary-60 text-sm hover:text-primary-50 transition-colors"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
} 