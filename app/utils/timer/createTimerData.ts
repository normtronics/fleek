import type CreateTimerInput from "../../interfaces/CreateTimerInput";
import type TimerData from "../../interfaces/TimerData";
import generateTimerId from "./generateTimerId";

export default function createTimerData(input: CreateTimerInput): TimerData {
  return {
    ...input,
    isFavorite: input.isFavorite || false,
    createdAt: new Date(),
    id: generateTimerId(),
  };
}