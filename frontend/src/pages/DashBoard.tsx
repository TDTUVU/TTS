import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTasks, FaClipboardList, FaCheck } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Modal from '../components/common/Model';
import taskService from '../services/taskService';
import { Task } from '../types';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await taskService.getAllTasks();
        setTasks(data);
    
        setStats({
          total: data.length,
          pending: data.filter(task => task.status === 'pending').length,
          inProgress: data.filter(task => task.status === 'in-progress').length,
          completed: data.filter(task => task.status === 'completed').length
        });
      } catch (error) {
        console.error('Không thể tải dữ liệu task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const renderSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white h-32 rounded-lg shadow-md"></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onLogoutClick={() => setShowLogoutModal(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {user ? `Dashboard` : 'Dashboard'}
        </h1>
        
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <FaTasks className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Tổng số công việc</h3>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="rounded-full bg-yellow-100 p-3 mr-4">
                  <FaClipboardList className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Đang thực hiện</h3>
                  <p className="text-2xl font-semibold">{stats.inProgress}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <FaCheck className="text-green-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Đã hoàn thành</h3>
                  <p className="text-2xl font-semibold">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Công việc gần đây</h2>
                <Link to="/tasks" className="text-blue-500 hover:text-blue-700">
                  Xem tất cả
                </Link>
              </div>
              
              {tasks.length === 0 ? (
                <p className="text-gray-500">Chưa có công việc nào.</p>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map(task => (
                    <div key={task._id} className="border-b pb-3">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'completed' ? 'Hoàn thành' : 
                          task.status === 'in-progress' ? 'Đang thực hiện' : 
                          'Chờ xử lý'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-center">
              <Link 
                to="/tasks/new" 
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tạo công việc mới
              </Link>
            </div>
          </>
        )}
      </main>
      
      <Footer />

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

export default Dashboard;