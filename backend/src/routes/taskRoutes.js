const express = require('express');
const { taskController } = require('../controllers');
const { auth } = require('../middleware');

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(auth);

// Route lấy tất cả tasks: GET /api/tasks
router.get('/', taskController.getTasks);

// Route tìm kiếm tasks: GET /api/tasks/search?keyword=abc
router.get('/search', taskController.searchTasks);

// Route lấy task theo ID: GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// Route tạo task mới: POST /api/tasks
router.post('/', taskController.createTask);

// Route cập nhật task: PUT /api/tasks/:id
router.put('/:id', taskController.updateTask);

// Route xóa task: DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

module.exports = router;
