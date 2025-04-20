import React from 'react';
import { Project } from '../types';
import { FolderPlus, Pencil, Trash2 } from 'lucide-react';
import Button from './ui/Button';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (projectId?: string) => void;
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onDeleteProject
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateProject}
          className="text-blue-600"
        >
          <FolderPlus size={18} className="mr-1" />
          New Project
        </Button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onSelectProject(undefined)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            !selectedProjectId
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          All Tasks
        </button>
        
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group flex items-center justify-between rounded-md transition-colors ${
              project.id === selectedProjectId
                ? 'bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <button
              onClick={() => onSelectProject(project.id)}
              className={`flex-1 text-left px-3 py-2 ${
                project.id === selectedProjectId
                  ? 'text-blue-700'
                  : 'text-gray-700'
              }`}
            >
              {project.name}
            </button>
            
            <div className="hidden group-hover:flex px-2 space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(project);
                }}
                className="text-gray-500 hover:text-blue-600"
              >
                <Pencil size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;