import type { ReactNode } from 'react';

interface HeaderProps {
  leftElement?: ReactNode;
  centerElement?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
}

export default function Header({ 
  leftElement, 
  centerElement, 
  rightElement, 
  className = "" 
}: HeaderProps) {
  // Determine layout based on presence of left element
  const hasLeftElement = !!leftElement;
  
  return (
    <header className={`px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left section - takes up space even if empty to maintain layout */}
        <div className="flex items-center">
          {leftElement}
        </div>
        
        {/* Center element - positioned based on left element presence */}
        {centerElement && (
          <div className={`flex items-center ${hasLeftElement ? 'text-center flex-1' : 'flex-1'}`}>
            {centerElement}
          </div>
        )}
        
        {/* Right element - always on the right */}
        <div className="flex items-center">
          {rightElement}
        </div>
      </div>
    </header>
  );
} 