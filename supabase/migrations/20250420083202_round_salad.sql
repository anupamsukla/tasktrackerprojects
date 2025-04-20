/*
  # Add projects support
  
  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `description` (text, nullable)
      - `user_id` (uuid, foreign key to auth.users)

  2. Changes
    - Add `project_id` column to tasks table
    - Add foreign key constraint from tasks to projects
    
  3. Security
    - Enable RLS on projects table
    - Add policies for users to manage their own projects
    - Update task policies to check project ownership
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add project_id to tasks
ALTER TABLE tasks ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Project policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update task policies to include project ownership check
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (project_id IS NULL OR project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (project_id IS NULL OR project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (project_id IS NULL OR project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (project_id IS NULL OR project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    ))
  );