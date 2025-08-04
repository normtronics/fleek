import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import createTimerData from '../utils/timer/createTimerData';
import validateTimerInput from '../utils/timer/validateTimerInput';
import type CreateTimerInput from '../interfaces/CreateTimerInput';
import { saveTimer } from '../utils/storage';
import { useTimer } from './useTimer';
import { 
  getProjectOptions, 
  getTaskOptions,
  createProject,
  createTask 
} from '../utils/projects';

export function useCreateTimerForm() {
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

  return {
    // Form State
    formData,
    errors,
    isSubmitting,
    projectOptions,
    taskOptions,
    
    // Handlers
    handleProjectChange,
    handleCreateProject,
    handleTaskChange,
    handleCreateTask,
    handleDescriptionChange,
    handleFavoriteToggle,
    handleSubmit,
  };
} 