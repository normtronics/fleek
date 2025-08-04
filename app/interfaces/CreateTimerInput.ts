export default interface CreateTimerInput {
  project: string;
  task: string;
  description: string;
  isFavorite?: boolean;
}