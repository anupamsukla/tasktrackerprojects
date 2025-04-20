import React, { useState } from 'react';
import { TaskStatus, StatusType } from '../types';
import Button from './ui/Button';
import TextArea from './ui/TextArea';

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  type: StatusType;
  currentStatus: TaskStatus;
  newStatus: TaskStatus;
  onStatusChange: (newStatus: TaskStatus, remarks: string) => void;
}

const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  isOpen,
  onClose,
  type,
  currentStatus,
  newStatus,
  onStatusChange,
}) => {
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusChange(newStatus, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          Update {type.toUpperCase()} Status
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Change status from{' '}
              <span className="font-medium">{currentStatus}</span> to{' '}
              <span className="font-medium">{newStatus}</span>
            </p>
          </div>
          <div className="mb-4">
            <TextArea
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any remarks about this status change..."
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusChangeDialog;