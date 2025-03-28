const express = require('express');
const { taskController } = require('../controllers');
const { auth } = require('../middleware');

const router = express.Router();

router.use(auth);

router.get('/', taskController.getTasks);

router.get('/search', taskController.searchTasks);

router.get('/:id', taskController.getTaskById);

router.post('/', taskController.createTask);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
