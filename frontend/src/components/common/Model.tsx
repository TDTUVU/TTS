import React, { MouseEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    // Ngăn chặn propagation để clicks trong modal không đóng modal
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()} // Ngăn click event từ bubbling
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Modal content */}
      <div 
        className="relative z-10 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click từ việc đóng modal
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;