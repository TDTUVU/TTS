import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Model';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-900">
      <header className="bg-transparent">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Xin chào, {user.username}</span>
                <Link 
                  to="/dashboard" 
                  className="w-32 px-6 py-2 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-32 px-6 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-32 px-6 py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login />
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register />
      </Modal>

      {/* Rest of your home page content */}
    </div>
  );
};

export default Home;