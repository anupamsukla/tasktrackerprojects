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

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type StatusType = 'dev' | 'qa' | 'final';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface TaskFormData {
  title: string;
  description?: string;
  dev_status?: TaskStatus;
  qa_status?: TaskStatus;
  final_status?: TaskStatus;
  priority: PriorityLevel;
  due_date?: string | null;
  project_id?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dev_status: TaskStatus;
  qa_status: TaskStatus;
  final_status: TaskStatus;
  priority: PriorityLevel;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_id: string;
}

export interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: TaskFormData;
  isSubmitting: boolean;
}
