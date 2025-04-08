import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { UserCredentials } from '../../types';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../../utils/errorMessages';

interface LoginProps {
  onClose?: () => void;
}

// ... existing code ...
const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<UserCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  // Thêm state để lưu thông báo lỗi
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    // Reset error khi người dùng bắt đầu nhập lại
    setError('');
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin các trường bắt buộc');
      return;
    }
    
    try {
      setLoading(true);
      setError(''); // Reset error khi bắt đầu submit
      await login(formData);
      
      // Nếu đến đây, login đã thành công
      toast.success('Đăng nhập thành công!');
      
      if (onClose) {
        onClose();
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Reset password
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
      
      // Xử lý và hiển thị lỗi trên form
      const axiosError = error as AxiosError<any>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const message = (errorData.message || '').toLowerCase();
        
        if (message.includes('invalid') || 
            message.includes('incorrect') || 
            message.includes('wrong') || 
            message.includes('not match')) {
          setError('Email hoặc mật khẩu không chính xác');
        } else {
          setError(message || 'Có lỗi xảy ra, vui lòng thử lại');
        }
      } else if (!axiosError.response) {
        setError('Không thể kết nối đến máy chủ');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl w-full">
      <h2 className="text-3xl font-semibold text-center text-white mb-8">Login Here</h2>
      
      {/* Hiển thị thông báo lỗi */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white text-lg mb-2">
            Username
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email or Phone"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-white text-lg mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold transition-all hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Log In'}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-white text-center mb-4">Login with a social media account</p>
        <div className="flex justify-center space-x-4">
          <button 
            className="p-3 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            aria-label="Đăng nhập bằng Facebook"
            title="Đăng nhập bằng Facebook"
          >
            <FaFacebookF className="w-5 h-5" />
            <span className="sr-only">Đăng nhập bằng Facebook</span>
          </button>
          <button 
            className="p-3 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            aria-label="Đăng nhập bằng Twitter"
            title="Đăng nhập bằng Twitter"
          >
            <FaTwitter className="w-5 h-5" />
            <span className="sr-only">Đăng nhập bằng Twitter</span>
          </button>
          <button 
            className="p-3 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            aria-label="Đăng nhập bằng Instagram"
            title="Đăng nhập bằng Instagram"
          >
            <FaInstagram className="w-5 h-5" />
            <span className="sr-only">Đăng nhập bằng Instagram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;