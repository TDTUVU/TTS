import api from './api';
import { User, RegisterData, UserCredentials } from '../types';

const register = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await api.post<any>('/auth/register', userData);
    // Chỉ lưu user nếu response trả về thành công
    if (response.data && response.data.success !== false) {
      // Không lưu user và token vào localStorage khi đăng ký
      // để buộc người dùng phải đăng nhập sau khi đăng ký
      return response.data;
    }
    return response.data;
  } catch (error) {
    // Log lỗi để debug
    console.error('Register error in service:', error);
    // Throw lại lỗi để context xử lý
    throw error;
  }
};

const login = async (credentials: UserCredentials): Promise<User> => {
  try {
    const response = await api.post<any>('/auth/login', credentials);
    // Chỉ lưu user và token nếu login thành công
    if (response.data && response.data.success !== false) {
      // Lưu user và token vào localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    }
    return response.data;
  } catch (error) {
    // Log lỗi để debug
    console.error('Login error in service:', error);
    // Throw lại lỗi để context xử lý
    throw error;
  }
};

const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  getProfile
};

export default authService;