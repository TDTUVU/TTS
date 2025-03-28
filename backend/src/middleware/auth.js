// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
   
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Không có token xác thực' });
        }
   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy người dùng' });
        }

        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Không được phép truy cập', error: error.message });
    }
};

module.exports = auth;