export default function calculateElapsedTime(startTime: Date, endTime: Date = new Date()): number {
  return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
}