import { ERROR_MESSAGES } from './errorMessages';

export const getErrorMessage = (error: any): string => {
  console.log('Error handling:', error.response?.data);
  
  // Xử lý lỗi validation
  if (error.response?.data?.errors) {
    const firstError = Object.values(error.response.data.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }

  // Xử lý message từ server
  const serverMessage = (error.response?.data?.message || error.response?.data?.error || '').toLowerCase();

  // Kiểm tra lỗi email tồn tại (cả tiếng Anh và tiếng Việt)
  if (serverMessage.includes('email') && 
      (serverMessage.includes('exists') || 
       serverMessage.includes('already') || 
       serverMessage.includes('đã') || 
       serverMessage.includes('tồn tại') || 
       serverMessage.includes('used'))) {
    return ERROR_MESSAGES.EMAIL_EXISTS;
  }

  // Kiểm tra lỗi đăng nhập không hợp lệ
  if (serverMessage.includes('invalid') || 
      serverMessage.includes('incorrect') || 
      serverMessage.includes('not found') || 
      serverMessage.includes('không chính xác') || 
      serverMessage.includes('không tìm thấy')) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS;
  }

  // Kiểm tra lỗi mật khẩu yếu
  if (serverMessage.includes('password') && 
      (serverMessage.includes('weak') || 
       serverMessage.includes('short') || 
       serverMessage.includes('yếu') || 
       serverMessage.includes('ngắn'))) {
    return ERROR_MESSAGES.WEAK_PASSWORD;
  }

  // Xử lý theo HTTP status
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin';
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này';
      case 404:
        return 'Không tìm thấy dữ liệu yêu cầu';
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại sau';
    }
  }

  // Xử lý lỗi network
  if (error.request && !error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Xử lý các lỗi khác
  return ERROR_MESSAGES.SERVER_ERROR;
};