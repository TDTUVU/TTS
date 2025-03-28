// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaUser } from 'react-icons/fa';
const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200';
  };
  
  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 z-10 pt-16">
      <div className="p-4">
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/dashboard')}`}
              >
                <FaHome className="text-lg" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/tasks" 
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tasks')}`}
              >
                <FaTasks className="text-lg" />
                <span>Công việc</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/profile')}`}
              >
                <FaUser className="text-lg" />
                <span>Tài khoản</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;