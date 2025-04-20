import { supabase } from '../lib/supabase';
import type { Project, ProjectFormData } from '../types';

export const fetchProjects = async (userId: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(error.message);
  }

  return data as Project[];
};

export const createProject = async (project: ProjectFormData, userId: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(error.message);
  }

  return data as Project;
};

export const updateProject = async (id: string, project: Partial<ProjectFormData>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw new Error(error.message);
  }

  return data as Project;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw new Error(error.message);
  }
};