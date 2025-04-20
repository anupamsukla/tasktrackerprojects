import { format } from 'date-fns';
import React from 'react';
import { StatusChange } from '../types';

interface StatusChangeHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  changes: StatusChange[];
}

const StatusChangeHistoryDialog: React.FC<StatusChangeHistoryDialogProps> = ({
  isOpen,
  onClose,
  changes
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-lg font-medium mb-4">Status Change History</h3>
        <div className="max-h-[60vh] overflow-y-auto">
          {changes.length === 0 ? (
            <p className="text-gray-500">No status changes recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {changes.map((change) => (
                <div key={change.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium capitalize">{change.status_type} Status Change</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(change.changed_at), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">
                        {change.statuses[0]} → {change.statuses[1]}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{change.remarks}</p>
                </div>
              ))}
            </div>
          )}
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

export default StatusChangeHistoryDialog;
