interface BriefcaseIconProps {
  className?: string;
}

export default function BriefcaseIcon({ className = "w-4 h-4" }: BriefcaseIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* Briefcase body */}
      <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={2} />
      {/* Handle */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
      {/* Lock/latch */}
      <circle cx="12" cy="14" r="1" strokeWidth={2} />
    </svg>
  );
} 