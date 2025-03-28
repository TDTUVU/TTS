export interface User {
    _id: string;
    username: string;
    email: string;
    token?: string;
  }
  
  export interface UserCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends UserCredentials {
    username: string;
  }
  
  export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTaskData {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
  }
  
  export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
  }
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }