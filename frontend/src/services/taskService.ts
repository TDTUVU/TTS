import api from './api';
import { Task, CreateTaskData, UpdateTaskData } from '../types';

const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${id}`);
  return response.data;
};

const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const response = await api.post<Task>('/tasks', taskData);
  return response.data;
};

const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, taskData);
  return response.data;
};

const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
};

const searchTasks = async (keyword: string): Promise<Task[]> => {
  const response = await api.get<Task[]>(`/tasks/search?keyword=${keyword}`);
  return response.data;
};

const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks
};

export default taskService;