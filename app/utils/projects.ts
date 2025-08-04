import type { DropdownOption } from '../components/Dropdown';

const STORAGE_KEYS = {
  PROJECTS: 'fleek_projects',
  TASKS: 'fleek_tasks',
} as const;

export interface ProjectData {
  id: string;
  label: string;
  createdAt: Date;
}

export interface TaskData {
  id: string;
  label: string;
  projectId: string;
  createdAt: Date;
}

/**
 * Gets default project options
 */
function getDefaultProjects(): ProjectData[] {
  return [
    { id: 'project1', label: 'Website Redesign', createdAt: new Date() },
    { id: 'project2', label: 'Mobile App Development', createdAt: new Date() },
    { id: 'project3', label: 'Marketing Campaign', createdAt: new Date() },
    { id: 'project4', label: 'Database Optimization', createdAt: new Date() },
    { id: 'project5', label: 'Client Consultation', createdAt: new Date() },
  ];
}

/**
 * Gets default task options for each project
 */
function getDefaultTasks(): TaskData[] {
  return [
    // Website Redesign tasks
    { id: 'design', label: 'UI/UX Design', projectId: 'project1', createdAt: new Date() },
    { id: 'frontend', label: 'Frontend Development', projectId: 'project1', createdAt: new Date() },
    { id: 'testing', label: 'Quality Assurance', projectId: 'project1', createdAt: new Date() },
    
    // Mobile App Development tasks
    { id: 'planning', label: 'Project Planning', projectId: 'project2', createdAt: new Date() },
    { id: 'development', label: 'Development', projectId: 'project2', createdAt: new Date() },
    { id: 'review', label: 'Code Review', projectId: 'project2', createdAt: new Date() },
    
    // Marketing Campaign tasks
    { id: 'strategy', label: 'Strategy Planning', projectId: 'project3', createdAt: new Date() },
    { id: 'content', label: 'Content Creation', projectId: 'project3', createdAt: new Date() },
    { id: 'analysis', label: 'Performance Analysis', projectId: 'project3', createdAt: new Date() },
    
    // Database Optimization tasks
    { id: 'db_analysis', label: 'Performance Analysis', projectId: 'project4', createdAt: new Date() },
    { id: 'optimization', label: 'Query Optimization', projectId: 'project4', createdAt: new Date() },
    { id: 'migration', label: 'Data Migration', projectId: 'project4', createdAt: new Date() },
    
    // Client Consultation tasks
    { id: 'meeting', label: 'Client Meeting', projectId: 'project5', createdAt: new Date() },
    { id: 'proposal', label: 'Proposal Writing', projectId: 'project5', createdAt: new Date() },
    { id: 'followup', label: 'Follow-up Communication', projectId: 'project5', createdAt: new Date() },
  ];
}

/**
 * Loads projects from localStorage or returns defaults
 */
export function getProjects(): ProjectData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (stored) {
      const projects = JSON.parse(stored);
      return projects.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
  
  // Return defaults and save them
  const defaults = getDefaultProjects();
  saveProjects(defaults);
  return defaults;
}

/**
 * Saves projects to localStorage
 */
export function saveProjects(projects: ProjectData[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}

/**
 * Loads tasks from localStorage or returns defaults
 */
export function getTasks(): TaskData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (stored) {
      const tasks = JSON.parse(stored);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
  
  // Return defaults and save them
  const defaults = getDefaultTasks();
  saveTasks(defaults);
  return defaults;
}

/**
 * Saves tasks to localStorage
 */
export function saveTasks(tasks: TaskData[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
}

/**
 * Creates a new project
 */
export function createProject(label: string): ProjectData {
  const projects = getProjects();
  const newProject: ProjectData = {
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    label,
    createdAt: new Date(),
  };
  
  const updatedProjects = [...projects, newProject];
  saveProjects(updatedProjects);
  return newProject;
}

/**
 * Creates a new task for a project
 */
export function createTask(label: string, projectId: string): TaskData {
  const tasks = getTasks();
  const newTask: TaskData = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    label,
    projectId,
    createdAt: new Date(),
  };
  
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return newTask;
}

/**
 * Gets project options formatted for dropdown
 */
export function getProjectOptions(): DropdownOption[] {
  const projects = getProjects();
  return projects.map(project => ({
    value: project.id,
    label: project.label,
  }));
}

/**
 * Gets task options for a specific project formatted for dropdown
 */
export function getTaskOptions(projectId?: string): DropdownOption[] {
  if (!projectId) return [];
  
  const tasks = getTasks();
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  return projectTasks.map(task => ({
    value: task.id,
    label: task.label,
  }));
}

/**
 * Gets a project by ID
 */
export function getProjectById(projectId: string): ProjectData | undefined {
  const projects = getProjects();
  return projects.find(project => project.id === projectId);
}

/**
 * Gets a task by ID
 */
export function getTaskById(taskId: string): TaskData | undefined {
  const tasks = getTasks();
  return tasks.find(task => task.id === taskId);
} 