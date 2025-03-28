// src/components/tasks/TaskList.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '../../services/taskService';
import TaskItem from './TaskItem';
import { Task } from '../../types';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      // Ghi log lỗi để sử dụng biến error
      console.error("Lỗi khi tải danh sách công việc:", error);
      toast.error('Không thể tải danh sách công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      toast.success('Đã xóa công việc');
    } catch (error) {
      // Ghi log lỗi để sử dụng biến error
      console.error("Lỗi khi xóa công việc:", error);
      toast.error('Không thể xóa công việc');
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const updatedTask = await taskService.updateTask(id, { status });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? { ...task, status: updatedTask.status } : task
        )
      );
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      // Ghi log lỗi để sử dụng biến error
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      fetchTasks();
      return;
    }
    
    try {
      setLoading(true);
      const data = await taskService.searchTasks(keyword);
      setTasks(data);
    } catch (error) {
      // Ghi log lỗi để sử dụng biến error
      console.error("Lỗi khi tìm kiếm công việc:", error);
      toast.error('Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Danh sách công việc</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            className="border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
          >
            Tìm
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Không có công việc nào. Hãy thêm công việc mới!
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;