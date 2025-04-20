CREATE OR REPLACE FUNCTION update_task_status(
    p_task_id UUID,
    p_status_type TEXT,
    p_new_status task_status,
    p_remarks TEXT,
    p_old_status task_status
) RETURNS tasks AS $$
DECLARE
    v_updated_task tasks;
BEGIN
    -- Update the task
    UPDATE tasks
    SET
        updated_at = CURRENT_TIMESTAMP,
        dev_status = CASE WHEN p_status_type = 'dev' THEN p_new_status ELSE dev_status END,
        qa_status = CASE WHEN p_status_type = 'qa' THEN p_new_status ELSE qa_status END,
        final_status = CASE WHEN p_status_type = 'final' THEN p_new_status ELSE final_status END,
        dev_status_changed_at = CASE WHEN p_status_type = 'dev' THEN CURRENT_TIMESTAMP ELSE dev_status_changed_at END,
        qa_status_changed_at = CASE WHEN p_status_type = 'qa' THEN CURRENT_TIMESTAMP ELSE qa_status_changed_at END,
        final_status_changed_at = CASE WHEN p_status_type = 'final' THEN CURRENT_TIMESTAMP ELSE final_status_changed_at END,
        dev_status_remarks = CASE WHEN p_status_type = 'dev' THEN p_remarks ELSE dev_status_remarks END,
        qa_status_remarks = CASE WHEN p_status_type = 'qa' THEN p_remarks ELSE qa_status_remarks END,
        final_status_remarks = CASE WHEN p_status_type = 'final' THEN p_remarks ELSE final_status_remarks END
    WHERE id = p_task_id
    RETURNING * INTO v_updated_task;

    -- Insert status change history
    INSERT INTO status_changes (
        task_id,
        status_type,
        old_status,
        new_status,
        remarks,
        changed_by
    ) VALUES (
        p_task_id,
        p_status_type,
        p_old_status,
        p_new_status,
        p_remarks,
        auth.uid()
    );

    RETURN v_updated_task;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;