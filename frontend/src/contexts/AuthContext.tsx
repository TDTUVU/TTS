import React, { useState, useEffect, createContext, ReactNode } from 'react';
import authService from '../services/authService';
import { User, RegisterData, UserCredentials } from '../types';

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  register: (userData: RegisterData) => Promise<User>;
  login: (credentials: UserCredentials) => Promise<User>;
  logout: () => void;
}

const defaultContext: AuthContextProps = {
  user: null,
  loading: true,
  register: async () => { throw new Error('register not implemented'); },
  login: async () => { throw new Error('login not implemented'); },
  logout: () => {}
};

export const AuthContext = createContext<AuthContextProps>(defaultContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Nếu có lỗi khi parse JSON, xóa dữ liệu lưu trữ không hợp lệ
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData: RegisterData): Promise<User> => {
    try {
      // Gọi API đăng ký nhưng không tự động đăng nhập
      const response = await authService.register(userData);
      // Không set user ở đây
      return response;
    } catch (error) {
      // Log lỗi để debug
      console.error('Register error in context:', error);
      // Throw lại lỗi để component xử lý
      throw error;
    }
  };

  const login = async (credentials: UserCredentials): Promise<User> => {
    try {
      const response = await authService.login(credentials);
      // Lưu user state khi login thành công
      setUser(response);
      return response;
    } catch (error) {
      // Log lỗi để debug
      console.error('Login error in context:', error);
      // Throw lại lỗi để component xử lý
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};