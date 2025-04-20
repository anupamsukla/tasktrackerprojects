import React, { useState, useEffect } from 'react';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import Select from './ui/Select';
import Button from './ui/Button';
import type { TaskFormData, TaskStatus, PriorityLevel } from '../types';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: TaskFormData;
  isSubmitting?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting,
  onCancel
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dev_status: 'todo',
    qa_status: 'todo',
    final_status: 'todo',
    priority: 'medium',
    due_date: null
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        dev_status: initialData.dev_status || 'todo',
        qa_status: initialData.qa_status || 'todo',
        final_status: initialData.final_status || 'todo',
        priority: initialData.priority,
        due_date: initialData.due_date
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'blocker', label: '🛑 Blocker' },
    { value: 'major', label: '⚠️ Major' },
    { value: 'high', label: '❗ High' },
    { value: 'medium', label: '• Medium' },
    { value: 'low', label: '↓ Low' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <TextArea
        label="Description"
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Dev Status"
          name="dev_status"
          value={formData.dev_status || 'todo'}
          onChange={(value) => handleSelectChange('dev_status', value)}
          options={statusOptions}
        />

        <Select
          label="QA Status"
          name="qa_status"
          value={formData.qa_status || 'todo'}
          onChange={(value) => handleSelectChange('qa_status', value)}
          options={statusOptions}
        />

        <Select
          label="Final Status"
          name="final_status"
          value={formData.final_status || 'todo'}
          onChange={(value) => handleSelectChange('final_status', value)}
          options={statusOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={(value) => handleSelectChange('priority', value as PriorityLevel)}
          options={priorityOptions}
        />

        <Input
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
