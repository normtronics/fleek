/**
 * Formats a date to a readable format with weekday and date
 * Example: "Monday, 15/01/2024"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

/**
 * Formats a date to show time in 24-hour format
 * Example: "14:30"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
} 