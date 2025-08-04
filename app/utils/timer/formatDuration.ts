export default function formatDuration(seconds: number): string {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [minutes, remainingSeconds]
    .map(num => num.toString().padStart(2, '0'))
    .join(':');
}