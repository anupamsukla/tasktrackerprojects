import React from 'react';
import { Task, StatusType, TaskStatus, StatusChange } from '../types';
import TaskTable from './TaskTable';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, statusType: StatusType, newStatus: TaskStatus, remarks: string) => void;
  onFetchStatusHistory: (taskId: string) => Promise<StatusChange[]>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onFetchStatusHistory
}) => {
  return (
    <div>
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onFetchStatusHistory={onFetchStatusHistory}
        />
      )}
    </div>
  );
};

export default TaskList;
