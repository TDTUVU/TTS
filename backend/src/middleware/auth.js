// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        // Kiểm tra xem header có chứa token không
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Không có token xác thực' });
        }
        
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tìm user trong database
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy người dùng' });
        }
        
        // Lưu thông tin user vào request để sử dụng trong các route
        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Không được phép truy cập', error: error.message });
    }
};

module.exports = auth;