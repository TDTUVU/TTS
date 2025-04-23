import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import TaskForm from '../components/tasks/TaskForm';
import taskService from '../services/taskService';
import { AxiosError } from 'axios';

interface TaskFormPageProps {
  isEditing?: boolean;
}

const TaskFormPage: React.FC<TaskFormPageProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    const verifyTask = async () => {
      if (isEditing && id) {
        try {
          await taskService.getTaskById(id);
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            toast.error('Công việc này đã bị xóa', {
              toastId: 'task-deleted',
              autoClose: 2000
            });
          } else {
            toast.error('Không thể tải thông tin công việc', {
              toastId: 'task-error',
              autoClose: 2000
            });
          }
          // Chuyển hướng về trang danh sách công việc
          navigate('/tasks');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyTask();
  }, [id, isEditing, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="flex justify-end space-x-4">
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

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