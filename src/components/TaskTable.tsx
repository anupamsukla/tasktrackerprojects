import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, History } from 'lucide-react';
import { Task, StatusType, TaskStatus, StatusChange } from '../types';
import Button from './ui/Button';
import StatusChangeDialog from './StatusChangeDialog';
import StatusChangeHistoryDialog from './StatusChangeHistoryDialog';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, statusType: StatusType, newStatus: TaskStatus, remarks: string) => void;
  onFetchStatusHistory: (taskId: string) => Promise<StatusChange[]>;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onFetchStatusHistory
}) => {
  const priorityColors = {
    blocker: 'bg-red-100 text-red-900 border-red-200',
    major: 'bg-orange-100 text-orange-900 border-orange-200',
    high: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const priorityIcons = {
    blocker: '🛑',
    major: '⚠️',
    high: '❗',
    medium: '•',
    low: '↓'
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800'
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    switch (current) {
      case 'todo': return 'in-progress';
      case 'in-progress': return 'completed';
      default: return 'todo';
    }
  };

  const [statusDialog, setStatusDialog] = useState<{
    taskId: string;
    currentStatus: TaskStatus;
    newStatus: TaskStatus;
    statusType: StatusType;
  } | null>(null);

  const [historyDialog, setHistoryDialog] = useState<{
    taskId: string;
    changes: StatusChange[];
  } | null>(null);

  const handleViewHistory = async (taskId: string) => {
    const changes = await onFetchStatusHistory(taskId);
    setHistoryDialog({ taskId, changes });
  };

  const handleStatusClick = (taskId: string, type: StatusType, currentStatus: TaskStatus) => {
    setStatusDialog({ taskId, currentStatus, newStatus: getNextStatus(currentStatus), statusType: type });
  };

  const renderStatusCell = (task: Task, type: StatusType) => {
    const status = task[`${type}_status`];
    const remarks = task[`${type}_status_remarks`];
    const changedAt = task[`${type}_status_changed_at`];

    return (
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col items-start space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
            {status.replace('-', ' ')}
          </span>
          {changedAt && (
            <span className="text-xs text-gray-500">
              Changed: {format(new Date(changedAt), 'MMM d, yyyy HH:mm')}
            </span>
          )}
          {remarks && (
            <span className="text-xs text-gray-600 max-w-xs truncate" title={remarks}>
              Remarks: {remarks}
            </span>
          )}
          <button
            onClick={() => handleStatusClick(task.id, type, task[`${type}_status`])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Update
          </button>
        </div>
      </td>
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dev Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QA Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Final Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{task.description || '-'}</div>
                </td>
                {(['dev', 'qa', 'final'] as const).map((type) => (
                  renderStatusCell(task, type)
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${priorityColors[task.priority]}`}
                  >
                    <span className="mr-1">{priorityIcons[task.priority]}</span>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(task)}
                      className="text-blue-600"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewHistory(task.id)}
                      className="text-gray-600"
                    >
                      <History size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {statusDialog && (
        <StatusChangeDialog
          isOpen={true}
          onClose={() => setStatusDialog(null)}
          taskId={statusDialog.taskId}
          type={statusDialog.statusType}
          currentStatus={statusDialog.currentStatus}
          newStatus={statusDialog.newStatus}
          onStatusChange={(newStatus, remarks) => {
            onStatusChange(statusDialog.taskId, statusDialog.statusType, newStatus, remarks);
            setStatusDialog(null);
          }}
        />
      )}
      {historyDialog && (
        <StatusChangeHistoryDialog
          isOpen={true}
          onClose={() => setHistoryDialog(null)}
          taskId={historyDialog.taskId}
          changes={historyDialog.changes}
        />
      )}
    </>
  );
};

export default TaskTable;
