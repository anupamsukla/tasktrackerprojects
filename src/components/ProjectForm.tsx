import React, { useState, useEffect } from 'react';
import { Project, ProjectFormData } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import TextArea from './ui/TextArea';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  initialData?: Project;
  isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter project name"
        required
      />
      
      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter project description (optional)"
        rows={3}
      />
      
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
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;