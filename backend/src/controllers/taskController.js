const { Task } = require('../models');

// Lấy tất cả task của user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy task theo ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Không tìm thấy task' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Tạo task mới
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      userId: req.userId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật task
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Tìm task và đảm bảo nó thuộc về user hiện tại
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Cập nhật thông tin task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    await task.deleteOne();
    res.json({ message: 'Đã xóa task' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Tìm kiếm task
const searchTasks = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    
    if (!keyword) {
      return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }

    const tasks = await Task.find({
      userId: req.userId,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks
};
