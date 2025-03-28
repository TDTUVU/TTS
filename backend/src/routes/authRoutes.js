const express = require('express');
const { authController } = require('../controllers');
const { auth } = require('../middleware');

const router = express.Router();

// Route đăng ký: POST /api/auth/register
router.post('/register', authController.register);

// Route đăng nhập: POST /api/auth/login
router.post('/login', authController.login);

// Route lấy thông tin profile: GET /api/auth/profile (yêu cầu xác thực)
router.get('/profile', auth, authController.getProfile);

module.exports = router;
