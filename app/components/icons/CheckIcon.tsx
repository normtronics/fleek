interface CheckIconProps {
  className?: string;
}

export default function CheckIcon({ className = "w-3 h-3" }: CheckIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
    </svg>
  );
} 