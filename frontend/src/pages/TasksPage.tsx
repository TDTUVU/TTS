import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Modal from '../components/common/Model';
import TaskItem from '../components/tasks/TaskItem';
import { useAuth } from '../hooks/useAuth';
import taskService from '../services/taskService';
import { Task } from '../types';
import Sidebar from '../components/layout/Sidebar';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách công việc
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await taskService.getAllTasks();
        setTasks(fetchedTasks);
        setError(null);
      } catch (error) {
        setError('Không thể tải danh sách công việc');
        toast.error('Không thể tải danh sách công việc', {
          toastId: 'fetch-tasks-error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      toast.success('Xóa công việc thành công', {
        toastId: `delete-success-${taskId}`
      });
    } catch (error) {
      // Xử lý lỗi được chuyển xuống TaskItem
      throw error;
    }
  };

  const handleStatusChange = async (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      await taskService.updateTask(taskId, { status });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status } : task
        )
      );
      toast.success('Cập nhật trạng thái thành công', {
        toastId: `status-success-${taskId}`
      });
    } catch (error) {
      // Xử lý lỗi được chuyển xuống TaskItem
      throw error;
    }
  };

  const handleTaskNotFound = (taskId: string) => {
    // Xóa task khỏi state local
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onLogoutClick={() => setShowLogoutModal(true)} />
      
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý công việc</h1>
            <Link 
              to="/tasks/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FaPlus />
              <span>Thêm công việc</span>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-500 hover:text-blue-700"
              >
                Thử lại
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Chưa có công việc nào</p>
              <Link
                to="/tasks/new"
                className="text-blue-500 hover:text-blue-700"
              >
                Thêm công việc mới
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  onTaskNotFound={() => handleTaskNotFound(task._id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      
      <Footer />

      {/* Modal xác nhận đăng xuất */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Xác nhận đăng xuất
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn đăng xuất?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                handleLogout();
                setShowLogoutModal(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;