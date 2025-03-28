const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const { authRoutes, taskRoutes } = require('./src/routes');
const { logger, errorHandler, notFound } = require('./src/middleware');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);  // Logger middleware ghi lại tất cả requests

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Middleware xử lý lỗi
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});