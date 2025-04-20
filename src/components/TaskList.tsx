import React, { useState } from 'react';
import { Task, FilterOption, SortOption } from '../types';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';
import { Filter, Search, SortDesc, LayoutGrid, Table } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  onSearch: (query: string) => void;
  onFilter: (status: FilterOption) => void;
  onSort: (sortBy: SortOption) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onSearch,
  onFilter,
  onSort
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-36 flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <Select
              options={[
                { value: 'all', label: 'All' },
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' }
              ]}
              onChange={onFilter}
              value="all"
            />
          </div>
          
          <div className="w-36 flex items-center gap-2">
            <SortDesc size={18} className="text-gray-500" />
            <Select
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'priority', label: 'Priority' },
                { value: 'due_date', label: 'Due Date' }
              ]}
              onChange={onSort}
              value="newest"
            />
          </div>

          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === 'card' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="rounded-none"
            >
              <LayoutGrid size={18} />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-none"
            >
              <Table size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};

export default TaskList;