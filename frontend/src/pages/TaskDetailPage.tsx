// src/pages/TaskDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import taskService from '../services/taskService';
import { Task } from '../types';
import { AxiosError } from 'axios';

// Định nghĩa kiểu dữ liệu cho response error
interface ErrorResponse {
  message?: string;
}

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (error) {
        // Kiểm tra kiểu lỗi và xử lý phù hợp
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.message || 'Không thể tải thông tin công việc';
        toast.error(errorMessage);
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await taskService.deleteTask(id);
      toast.success('Đã xóa công việc');
      navigate('/tasks');
    } catch (error) {
      // Kiểm tra kiểu lỗi và xử lý phù hợp
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Không thể xóa công việc';
      toast.error(errorMessage);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'in-progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link to="/tasks" className="flex items-center text-blue-500 mb-6 hover:text-blue-700">
          <FaArrowLeft className="mr-2" />
          Quay lại danh sách
        </Link>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        ) : task ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
              
              <div className="flex space-x-2">
                <Link 
                  to={`/tasks/edit/${task._id}`}
                  className="text-blue-500 hover:text-blue-700 p-2"
                >
                  <FaEdit className="text-xl" />
                  <span className="sr-only">Chỉnh sửa</span>
                </Link>
                
                {!confirmDelete ? (
                  <button 
                    onClick={() => setConfirmDelete(true)} 
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label="Xóa công việc"
                    title="Xóa công việc"
                  >
                    <FaTrash className="text-xl" />
                    <span className="sr-only">Xóa</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
              <span className="text-gray-500 text-sm ml-4">
                Tạo ngày: {new Date(task.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="text-gray-500 text-sm ml-4">
                Cập nhật: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Mô tả</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {task.description || 'Không có mô tả'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">Không tìm thấy công việc</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TaskDetailPage;