import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import TaskForm from '../components/tasks/TaskForm';

interface TaskFormPageProps {
  isEditing?: boolean;
}

const TaskFormPage: React.FC<TaskFormPageProps> = ({ isEditing = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <TaskForm isEditing={isEditing} />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaskFormPage;