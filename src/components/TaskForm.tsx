import React, { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import Select from './ui/Select';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Task;
  isSubmitting: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: undefined
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        required
      />
      
      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter task description (optional)"
        rows={3}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={(value) => handleSelectChange('priority', value)}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
        />
        
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={(value) => handleSelectChange('status', value)}
          options={[
            { value: 'todo', label: 'To Do' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' }
          ]}
        />
        
        <Input
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date || ''}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
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