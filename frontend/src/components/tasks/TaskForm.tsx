// src/components/tasks/TaskForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import taskService from '../../services/taskService';
import { CreateTaskData } from '../../types';
// Đã xóa import Task vì không sử dụng
import { AxiosError } from 'axios';

// Định nghĩa kiểu dữ liệu cho response error
interface ErrorResponse {
  message?: string;
}

interface TaskFormProps {
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: 'pending'
  });

  // Sử dụng useCallback để fetchTask không thay đổi giữa các lần render
  const fetchTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      const task = await taskService.getTaskById(taskId);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status
      });
    } catch (error) {
      // Sử dụng error để tránh lỗi unused
      console.error("Lỗi khi tải thông tin task:", error);
      toast.error('Không thể tải thông tin công việc');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isEditing && id) {
      fetchTask(id);
    }
  }, [isEditing, id, fetchTask]); // Thêm fetchTask vào dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Vui lòng nhập tiêu đề công việc');
      return;
    }
    
    try {
      setLoading(true);
      if (isEditing && id) {
        await taskService.updateTask(id, formData);
        toast.success('Cập nhật công việc thành công');
      } else {
        await taskService.createTask(formData);
        toast.success('Tạo công việc thành công');
      }
      navigate('/tasks');
    } catch (error) {
      // Sử dụng type assertion với kiểu cụ thể
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Cập nhật công việc' : 'Thêm công việc mới'}
      </h2>
      
      {loading && !isEditing ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Nhập tiêu đề công việc"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Nhập mô tả chi tiết"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Chờ xử lý</option>
              <option value="in-progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={() => navigate('/tasks')}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;