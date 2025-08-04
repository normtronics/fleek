import type { Route } from './+types/create-timer';

import { Header } from '../components/Header';
import { Dropdown } from '../components/Dropdown';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { useCreateTimerForm } from '../hooks/useCreateTimerForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Timer - Fleek" },
    { name: "description", content: "Create a new timer for your project tasks" },
  ];
}

export default function CreateTimer() {
  const {
    formData,
    errors,
    isSubmitting,
    projectOptions,
    taskOptions,
    handleProjectChange,
    handleCreateProject,
    handleTaskChange,
    handleCreateTask,
    handleDescriptionChange,
    handleFavoriteToggle,
    handleSubmit,
  } = useCreateTimerForm();

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Create Timer" />
      
      <main className="flex-1 p-4 pb-safe">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          {/* Project Selection */}
          <div>
            <Dropdown
              options={projectOptions}
              value={formData.project}
              placeholder="Project"
              onChange={handleProjectChange}
              onCreateNew={handleCreateProject}
              searchable
              allowCreate
            />
            {errors.project && (
              <p className="mt-2 text-sm text-red-400">{errors.project}</p>
            )}
          </div>

          {/* Task Selection */}
          <div>
            <Dropdown
              options={taskOptions}
              value={formData.task}
              placeholder="Task"
              onChange={handleTaskChange}
              onCreateNew={handleCreateTask}
              disabled={!formData.project}
              searchable
              allowCreate
            />
            {errors.task && (
              <p className="mt-2 text-sm text-red-400">{errors.task}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <TextField
              placeholder="Description"
              value={formData.description}
              onChange={handleDescriptionChange}
              error={errors.description}
            />
          </div>

          {/* Make Favorite Checkbox */}
          <div className="flex items-center space-x-3 p-4">
            <input
              type="checkbox"
              id="make-favorite"
              checked={formData.isFavorite}
              onChange={handleFavoriteToggle}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <label htmlFor="make-favorite" className="text-white/90 font-medium cursor-pointer">
              Make Favorite
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Create Timer Button */}
          <div className="pt-6">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Timer
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
} 