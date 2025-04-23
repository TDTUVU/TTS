import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { Task } from '../../types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: 'pending' | 'in-progress' | 'completed') => Promise<void>;
  onTaskNotFound?: () => void; // Thêm prop mới để xử lý khi task không tồn tại
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onDelete, 
  onStatusChange,
  onTaskNotFound 
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(task._id);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        toast.error('Công việc này đã bị xóa', {
          toastId: `delete-not-found-${task._id}`,
          autoClose: 2000
        });
        // Gọi callback để xóa task khỏi UI
        onTaskNotFound?.();
      } else {
        toast.error('Không thể xóa công việc', {
          toastId: `delete-error-${task._id}`
        });
      }
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleStatusChange = async (status: 'pending' | 'in-progress' | 'completed') => {
    try {
      setLoading(true);
      await onStatusChange(task._id, status);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        toast.error('Công việc này đã bị xóa', {
          toastId: `status-not-found-${task._id}`,
          autoClose: 2000
        });
        // Gọi callback để xóa task khỏi UI
        onTaskNotFound?.();
      } else {
        toast.error('Không thể cập nhật trạng thái công việc', {
          toastId: `status-error-${task._id}`
        });
      }
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mb-2">{task.description}</p>
          )}
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
            {task.status === 'pending' && 'Chờ xử lý'}
            {task.status === 'in-progress' && 'Đang thực hiện'}
            {task.status === 'completed' && 'Hoàn thành'}
          </span>
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
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
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