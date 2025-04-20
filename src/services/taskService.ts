import { supabase } from '../lib/supabase';
import type { Task, TaskFormData, TaskStatus, StatusType, StatusChange } from '../types';

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }

  return data as Task[];
};

export const createTask = async (task: TaskFormData, userId: string): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...task,
      user_id: userId,
      dev_status: task.dev_status || 'todo',
      qa_status: task.qa_status || 'todo',
      final_status: task.final_status || 'todo'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }

  return data as Task;
};

export const updateTask = async (id: string, task: Partial<TaskFormData>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error(error.message);
  }

  return data as Task;
};

export const updateTaskStatus = async (
  taskId: string,
  statusType: StatusType,
  newStatus: TaskStatus,
  remarks: string
): Promise<Task> => {
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select(`*, ${statusType}_status`)
    .eq('id', taskId)
    .single();

  if (taskError) {
    console.error('Error fetching task:', taskError);
    throw new Error(taskError.message);
  }

  const oldStatus = task[`${statusType}_status`];

  // Start a transaction to update both tables
  const { data: updatedTask, error: updateError } = await supabase
    .rpc('update_task_status', {
      p_task_id: taskId,
      p_status_type: statusType,
      p_new_status: newStatus,
      p_remarks: remarks,
      p_old_status: oldStatus
    });

  if (updateError) {
    console.error('Error updating task status:', updateError);
    throw new Error(updateError.message);
  }

  return updatedTask as Task;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }
};

export const searchTasks = async (query: string, userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching tasks:', error);
    throw new Error(error.message);
  }

  return data as Task[];
};

export const fetchStatusHistory = async (taskId: string): Promise<StatusChange[]> => {
  const { data, error } = await supabase
    .from('status_changes')
    .select('*')
    .eq('task_id', taskId)
    .order('changed_at', { ascending: false });

  if (error) throw error;
  return data;
};
