/**
 * Formats time components into a consistent HH:MM:SS format
 * @param hours - Number of hours
 * @param minutes - Number of minutes  
 * @param seconds - Number of seconds
 * @returns Formatted time string in HH:MM:SS format
 */
export default function formatFullTime(hours: number, minutes: number, seconds: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
} 