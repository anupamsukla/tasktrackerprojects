import React from 'react';
import { Project } from '../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Projects</h2>
        <Button onClick={onCreateProject} size="sm">
          <Plus size={16} />
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No projects yet. Create your first project to get started!
        </p>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group flex items-center justify-between rounded-md transition-colors ${project.id === selectedProjectId
                ? 'bg-blue-50'
                : 'hover:bg-gray-50'
                }`}
            >
              <button
                onClick={() => onSelectProject(project.id)}
                className={`flex-1 text-left px-3 py-2 ${project.id === selectedProjectId
                  ? 'text-blue-700'
                  : 'text-gray-700'
                  }`}
              >
                {project.name}
              </button>
              <div className="hidden group-hover:flex items-center px-2 space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
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
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
