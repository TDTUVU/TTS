import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

interface RegisterProps {
  onClose?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
  
      setFormData({
        username: '',
        email: '',
        password: ''
      });
  
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl w-full">
      <h2 className="text-3xl font-semibold text-center text-white mb-8">Register Here</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-white text-lg mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-white text-lg mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email"
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
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold transition-all hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Register'}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-white text-center mb-4">Register with a social media account</p>
        <div className="flex justify-center space-x-4">
          <button 
            className="p-3 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            aria-label="Đăng ký bằng Facebook"
            title="Đăng ký bằng Facebook"
          >
            <FaFacebookF className="w-5 h-5" />
            <span className="sr-only">Đăng ký bằng Facebook</span>
          </button>
          <button 
            className="p-3 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            aria-label="Đăng ký bằng Twitter"
            title="Đăng ký bằng Twitter"
          >
            <FaTwitter className="w-5 h-5" />
            <span className="sr-only">Đăng ký bằng Twitter</span>
          </button>
          <button 
            className="p-3 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            aria-label="Đăng ký bằng Instagram"
            title="Đăng ký bằng Instagram"
          >
            <FaInstagram className="w-5 h-5" />
            <span className="sr-only">Đăng ký bằng Instagram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;