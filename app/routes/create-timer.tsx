import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/create-timer';

import { Header } from '../components/Header';
import { Dropdown } from '../components/Dropdown';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

import createTimerData  from '../utils/timer/createTimerData';
import validateTimerInput from '../utils/timer/validateTimerInput';
import type CreateTimerInput from '../interfaces/CreateTimerInput';
import { saveTimer } from '../utils/storage';
import { useTimer } from '../hooks/useTimer';
import { 
  getProjectOptions, 
  getTaskOptions,
  createProject,
  createTask 
} from '../utils/projects';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Timer - Fleek" },
    { name: "description", content: "Create a new timer for your project tasks" },
  ];
}

export default function CreateTimer() {
  const navigate = useNavigate();
  const { startTimer } = useTimer();
  const [formData, setFormData] = useState<CreateTimerInput>({
    project: '',
    task: '',
    description: '',
    isFavorite: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectOptions, setProjectOptions] = useState(getProjectOptions());
  const [taskOptions, setTaskOptions] = useState(getTaskOptions(formData.project));

  // Update task options when project changes
  useEffect(() => {
    setTaskOptions(getTaskOptions(formData.project));
  }, [formData.project]);

  const handleProjectChange = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      project: projectId,
      task: '', // Reset task when project changes
    }));
    // Clear project error when user selects a project
    if (errors.project) {
      setErrors(prev => ({ ...prev, project: '' }));
    }
  };

  const handleCreateProject = (label: string) => {
    const newProject = createProject(label);
    setProjectOptions(getProjectOptions()); // Refresh options
    setFormData(prev => ({
      ...prev,
      project: newProject.id,
      task: '', // Reset task when project changes
    }));
  };

  const handleTaskChange = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      task: taskId,
    }));
    // Clear task error when user selects a task
    if (errors.task) {
      setErrors(prev => ({ ...prev, task: '' }));
    }
  };

  const handleCreateTask = (label: string) => {
    if (!formData.project) return;
    
    const newTask = createTask(label, formData.project);
    setTaskOptions(getTaskOptions(formData.project)); // Refresh options
    setFormData(prev => ({
      ...prev,
      task: newTask.id,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const description = e.target.value;
    setFormData(prev => ({
      ...prev,
      description,
    }));
    // Clear description error when user types
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleFavoriteToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isFavorite: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTimerInput(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const timerData = createTimerData(formData);
      saveTimer(timerData);
      
      // Start the timer immediately
      startTimer(timerData);
      
      // Navigate back to home or timer list
      navigate('/');
    } catch (error) {
      console.error('Failed to create timer:', error);
      setErrors({ submit: 'Failed to create timer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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