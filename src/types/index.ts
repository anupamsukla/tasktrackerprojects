export type User = {
  id: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  user_id: string;
};

export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'user_id'>;

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  user_id: string;
  project_id?: string;
};

export type TaskFormData = Omit<Task, 'id' | 'created_at' | 'user_id'>;

export type SortOption = 'newest' | 'oldest' | 'priority' | 'due_date';
export type FilterOption = 'all' | 'todo' | 'in-progress' | 'completed';