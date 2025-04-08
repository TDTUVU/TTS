const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    // Xử lý các loại lỗi khác nhau
    if (error.name === 'ValidationError') {
      // Lấy thông báo lỗi từ mongoose validation
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages[0] });
    }
    
    if (error.code === 11000) {
      // Xử lý lỗi trùng lặp (duplicate key)
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'Email' : 'Username'} đã được sử dụng` 
      });
    }

    // Các lỗi khác
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi đăng ký, vui lòng thử lại sau',
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập đầy đủ email và mật khẩu' 
      });
    }

    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi đăng nhập, vui lòng thử lại sau',
      error: error.message 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi tải thông tin người dùng',
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};