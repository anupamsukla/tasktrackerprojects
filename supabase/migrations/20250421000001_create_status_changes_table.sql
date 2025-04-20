-- Create status_changes table
CREATE TABLE status_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    status_type TEXT NOT NULL CHECK (status_type IN ('dev', 'qa', 'final')),
    old_status task_status NOT NULL,
    new_status task_status NOT NULL,
    remarks TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index
CREATE INDEX idx_status_changes_task_id ON status_changes(task_id);

-- Add RLS policies
ALTER TABLE status_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status changes for their tasks"
    ON status_changes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.id = status_changes.task_id
        AND tasks.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert status changes for their tasks"
    ON status_changes FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.id = status_changes.task_id
        AND tasks.user_id = auth.uid()
    ));

-- Grant permissions
GRANT ALL ON status_changes TO authenticated;