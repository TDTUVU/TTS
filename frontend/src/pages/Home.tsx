import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Model';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { FaTasks, FaCheckCircle, FaClock, FaMobile } from 'react-icons/fa';
import backgroundImage from '../assets/1.jpg';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const features = [
    {
      icon: <FaTasks className="w-12 h-12 text-blue-500" />,
      title: "Quản lý công việc dễ dàng",
      description: "Tạo, theo dõi và quản lý các nhiệm vụ của bạn một cách hiệu quả"
    },
    {
      icon: <FaCheckCircle className="w-12 h-12 text-green-500" />,
      title: "Theo dõi tiến độ",
      description: "Cập nhật trạng thái và theo dõi tiến độ công việc theo thời gian thực"
    },
    {
      icon: <FaClock className="w-12 h-12 text-purple-500" />,
      title: "Nhắc nhở thông minh",
      description: "Không bao giờ bỏ lỡ deadline với hệ thống nhắc nhở tự động"
    },
    {
      icon: <FaMobile className="w-12 h-12 text-orange-500" />,
      title: "Truy cập mọi nơi",
      description: "Sử dụng ứng dụng trên mọi thiết bị, mọi lúc, mọi nơi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-gray-900">
      {/* Header */}
      <header className="bg-transparent relative z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Xin chào, {user.username}</span>
                <Link 
                  to="/dashboard" 
                  className="w-32 px-6 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-32 px-6 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-32 px-6 py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section với background */}
      <section className="relative py-20 text-center">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-animate"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: '0.3',
            filter: 'blur(1px)'
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/60 to-gray-900/60 z-1" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Quản lý công việc hiệu quả hơn
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Tối ưu hóa năng suất của bạn với công cụ quản lý công việc thông minh.
            Dễ dàng tạo, theo dõi và hoàn thành các nhiệm vụ.
          </p>
          {!user && (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Bắt đầu miễn phí
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20 relative z-10">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Tính năng nổi bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/30 relative z-10">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Task Manager. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* Modals */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onClose={() => setIsLoginOpen(false)} />
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register onClose={() => setIsRegisterOpen(false)} />
      </Modal>
    </div>
  );
};

export default Home;