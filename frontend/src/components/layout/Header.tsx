// src/components/layout/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">Task Manager</Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-500">Trang chủ</Link>
          {user && <Link to="/tasks" className="text-gray-600 hover:text-blue-500">Công việc</Link>}
          {user && <Link to="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</Link>}
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-gray-600">
                Xin chào, <span className="font-semibold">{user.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
                Đăng nhập
              </Link>
              <Link to="/register" className="hidden md:inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;