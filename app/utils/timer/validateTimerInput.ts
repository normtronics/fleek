import type CreateTimerInput from "../../interfaces/CreateTimerInput";

export default function validateTimerInput(input: CreateTimerInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.project?.trim()) {
    errors.project = 'Project is required';
  }

  if (!input.task?.trim()) {
    errors.task = 'Task is required';
  }

  if (input.description && input.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
