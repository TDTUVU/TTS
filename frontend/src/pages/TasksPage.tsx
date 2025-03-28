// src/pages/TasksPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TaskList from '../components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
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
    </div>
  );
};

export default TasksPage;