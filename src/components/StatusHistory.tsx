import React from 'react';
import { format } from 'date-fns';
import { Task, StatusType } from '../types';

interface StatusHistoryProps {
  task: Task;
  onClose: () => void;
}

const StatusHistory: React.FC<StatusHistoryProps> = ({ task, onClose }) => {
  const statusTypes: StatusType[] = ['dev', 'qa', 'final'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-lg font-medium mb-4">Status History</h3>
        <div className="space-y-6">
          {statusTypes.map((type) => {
            const status = task[`${type}_status`];
            const remarks = task[`${type}_status_remarks`];
            const changedAt = task[`${type}_status_changed_at`];

            return (
              <div key={type} className="border-b pb-4">
                <h4 className="font-medium capitalize mb-2">{type} Status</h4>
                <div className="space-y-1 text-sm">
                  <p>Current Status: {status}</p>
                  {changedAt && (
                    <p>Last Changed: {format(new Date(changedAt), 'MMM d, yyyy HH:mm:ss')}</p>
                  )}
                  {remarks && (
                    <p>Remarks: {remarks}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusHistory;