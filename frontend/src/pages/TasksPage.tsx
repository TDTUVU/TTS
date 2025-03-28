import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Modal from '../components/common/Model';
import TaskList from '../components/tasks/TaskList';
import { useAuth } from '../hooks/useAuth';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onLogoutClick={() => setShowLogoutModal(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
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
        
        <TaskList />
      </main>
      
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