export interface TaskFormData {
  title: string;
  description?: string;
  dev_status?: TaskStatus;
  qa_status?: TaskStatus;
  final_status?: TaskStatus;
  priority: string;
  due_date?: string;
  project_id?: string;
}