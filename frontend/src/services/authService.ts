import api from './api';
import { User, RegisterData, UserCredentials } from '../types';

const register = async (userData: RegisterData): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  }
  return response.data;
};

const login = async (credentials: UserCredentials): Promise<User> => {
  const response = await api.post<User>('/auth/login', credentials);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  }
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/auth/profile');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile
};

export default authService;