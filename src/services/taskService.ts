import { supabase } from '../lib/supabase';
import type { Task, TaskFormData } from '../types';

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
    .insert([{ ...task, user_id: userId }])
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

export const searchTasks = async (
  userId: string,
  query: string,
  status?: string
): Promise<Task[]> => {
  let queryBuilder = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', `%${query}%`);

  if (status && status !== 'all') {
    queryBuilder = queryBuilder.eq('status', status);
  }

  const { data, error } = await queryBuilder.order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching tasks:', error);
    throw new Error(error.message);
  }

  return data as Task[];
};