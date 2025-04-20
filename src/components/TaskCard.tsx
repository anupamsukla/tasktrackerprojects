import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { Task } from '../types';
import Button from './ui/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onStatusChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800'
  };

  const getNextStatus = (): Task['status'] => {
    switch (task.status) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      default:
        return 'todo';
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden 
        transition-all duration-200 hover:shadow-md
        ${task.status === 'completed' ? 'opacity-80' : ''}
      `}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <div className="flex space-x-1">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>
        
        {task.due_date && (
          <p className="text-sm text-gray-500 mb-2">
            Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
          </p>
        )}
        
        {isExpanded && task.description && (
          <p className="text-gray-700 mt-2 text-sm">
            {task.description}
          </p>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onStatusChange(task.id, getNextStatus())}
          className="text-gray-700"
        >
          <CheckCircle size={16} className="mr-1" />
          {task.status === 'completed' ? 'Reopen' : 'Next Status'}
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-blue-600"
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;