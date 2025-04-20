import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Task, TaskFormData, FilterOption, SortOption, Project, ProjectFormData } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ProjectSelector from '../components/ProjectSelector';
import ProjectForm from '../components/ProjectForm';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  searchTasks 
} from '../services/taskService';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject
} from '../services/projectService';

const TasksPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProjects();
      loadTasks();
    }
  }, [user]);

  useEffect(() => {
    if (tasks.length > 0) {
      applyFiltersAndSearch(tasks);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      if (!user) return;
      const fetchedProjects = await fetchProjects(user.id);
      setProjects(fetchedProjects);
    } catch (err) {
      setError('Failed to load projects.');
      console.error(err);
    }
  };

  const loadTasks = async () => {
    try {
      if (!user) return;
      const fetchedTasks = await fetchTasks(user.id);
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks.');
      console.error(err);
    }
  };

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      if (!user) return;
      setIsSubmitting(true);
      setError(null);
      
      const newProject = await createProject(data, user.id);
      setProjects((prev) => [newProject, ...prev]);
      setIsProjectFormOpen(false);
    } catch (err) {
      setError('Failed to create project.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    try {
      if (!selectedProject) return;
      setIsSubmitting(true);
      setError(null);
      
      const updatedProject = await updateProject(selectedProject.id, data);
      setProjects((prev) =>
        prev.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      );
      setSelectedProject(undefined);
      setIsProjectFormOpen(false);
    } catch (err) {
      setError('Failed to update project.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      setError(null);
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      if (selectedProjectId === id) {
        setSelectedProjectId(undefined);
      }
    } catch (err) {
      setError('Failed to delete project.');
      console.error(err);
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      if (!user) return;
      setIsSubmitting(true);
      setError(null);
      
      const taskData = {
        ...data,
        project_id: selectedProjectId
      };
      
      const newTask = await createTask(taskData, user.id);
      setTasks((prev) => [newTask, ...prev]);
      applyFiltersAndSearch([newTask, ...tasks]);
      setIsTaskFormOpen(false);
    } catch (err) {
      setError('Failed to create task.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    try {
      if (!selectedTask) return;
      setIsSubmitting(true);
      setError(null);
      
      const updatedTask = await updateTask(selectedTask.id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      applyFiltersAndSearch(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setSelectedTask(undefined);
      setIsTaskFormOpen(false);
    } catch (err) {
      setError('Failed to update task.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      applyFiltersAndSearch(updatedTasks);
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      setError(null);
      const updatedTask = await updateTask(id, { status });
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      applyFiltersAndSearch(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (err) {
      setError('Failed to update task status.');
      console.error(err);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsProjectFormOpen(true);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(tasks, currentFilter, query);
  };

  const handleFilter = (status: FilterOption) => {
    setCurrentFilter(status);
    applyFiltersAndSearch(tasks, status, searchQuery);
  };

  const handleSort = (sortBy: SortOption) => {
    let sortedTasks = [...filteredTasks];
    
    switch (sortBy) {
      case 'newest':
        sortedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sortedTasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'priority':
        sortedTasks.sort((a, b) => {
          const priorityValues = { high: 3, medium: 2, low: 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        });
        break;
      case 'due_date':
        sortedTasks.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        break;
    }
    
    setFilteredTasks(sortedTasks);
  };

  const applyFiltersAndSearch = (
    taskList: Task[], 
    filter = currentFilter, 
    query = searchQuery
  ) => {
    let result = [...taskList];
    
    // Filter by project
    if (selectedProjectId) {
      result = result.filter((task) => task.project_id === selectedProjectId);
    }
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter((task) => task.status === filter);
    }
    
    // Apply search query
    if (query) {
      result = result.filter((task) => 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        (task.description?.toLowerCase().includes(query.toLowerCase()) || false)
      );
    }
    
    setFilteredTasks(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
          
          <div className="flex items-center">
            {user && (
              <div className="flex items-center mr-4">
                <span className="text-sm text-gray-600 mr-2">{user.email}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-gray-600"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onCreateProject={() => {
                setSelectedProject(undefined);
                setIsProjectFormOpen(true);
              }}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>
          
          <div className="col-span-12 md:col-span-9">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedProjectId 
                  ? `Tasks - ${projects.find(p => p.id === selectedProjectId)?.name}`
                  : 'All Tasks'
                }
              </h2>
              <Button 
                onClick={() => {
                  setSelectedTask(undefined);
                  setIsTaskFormOpen(true);
                }}
              >
                <Plus size={18} className="mr-1" />
                Add Task
              </Button>
            </div>
            
            {isProjectFormOpen && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {selectedProject ? 'Edit Project' : 'Create New Project'}
                </h3>
                <ProjectForm
                  onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
                  onCancel={() => {
                    setIsProjectFormOpen(false);
                    setSelectedProject(undefined);
                  }}
                  initialData={selectedProject}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
            
            {isTaskFormOpen && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {selectedTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <TaskForm
                  onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
                  onCancel={() => {
                    setIsTaskFormOpen(false);
                    setSelectedTask(undefined);
                  }}
                  initialData={selectedTask}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
            
            <TaskList 
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasksPage;