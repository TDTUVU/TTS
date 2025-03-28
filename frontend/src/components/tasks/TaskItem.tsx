// src/components/tasks/TaskItem.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: 'pending' | 'in-progress' | 'completed') => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onStatusChange }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(task._id);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleStatusChange = async (status: 'pending' | 'in-progress' | 'completed') => {
    try {
      setLoading(true);
      await onStatusChange(task._id, status);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('vi-VN');

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1">{task.description}</p>
          )}
          <div className="mt-2 flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
              {task.status === 'pending' && 'Chờ xử lý'}
              {task.status === 'in-progress' && 'Đang thực hiện'}
              {task.status === 'completed' && 'Hoàn thành'}
            </span>
            <span className="text-gray-500 text-sm ml-3">{formattedDate}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!confirmDelete ? (
            <>
              <Link 
                to={`/tasks/edit/${task._id}`} 
                className="text-blue-500 hover:text-blue-700 p-2"
                aria-label="Chỉnh sửa công việc"
                title="Chỉnh sửa công việc"
              >
                <FaEdit />
                <span className="sr-only">Chỉnh sửa</span>
              </Link>

              <button 
                onClick={() => setConfirmDelete(true)} 
                className="text-red-500 hover:text-red-700 p-2"
                disabled={loading}
                aria-label="Xóa công việc"
                title="Xóa công việc"
              >
                <FaTrash />
                <span className="sr-only">Xóa</span>
              </button>
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="text-green-500 hover:text-green-700 p-2"
                  disabled={loading}
                  aria-label="Đánh dấu hoàn thành"
                  title="Đánh dấu hoàn thành"
                >
                  <FaCheck />
                  <span className="sr-only">Đánh dấu hoàn thành</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                disabled={loading}
              >
                {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;