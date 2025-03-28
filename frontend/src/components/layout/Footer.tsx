// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Task Manager</h3>
            <p className="text-gray-400 mt-1">Quản lý công việc dễ dàng</p>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Task Manager App. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;