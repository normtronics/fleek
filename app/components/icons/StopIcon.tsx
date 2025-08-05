interface StopIconProps {
  className?: string;
}

export default function StopIcon({ className = "w-6 h-6" }: StopIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z" />
    </svg>
  );
} 