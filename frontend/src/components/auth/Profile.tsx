// src/components/auth/Profile.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// Xóa import useAuth vì không sử dụng
// import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await authService.getProfile();
        setProfile({
          username: data.username,
          email: data.email
        });
      } catch (error) { 
        // Ghi log lỗi để sử dụng biến error
        console.error("Lỗi khi tải thông tin profile:", error);
        toast.error('Không thể tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Thông tin tài khoản</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Tên người dùng</label>
        <div className="py-2 px-3 bg-gray-100 rounded">{profile.username}</div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <div className="py-2 px-3 bg-gray-100 rounded">{profile.email}</div>
      </div>
    </div>
  );
};

export default Profile;