const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const { authRoutes, taskRoutes } = require('./src/routes');
const { logger, errorHandler, notFound } = require('./src/middleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(logger); 


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});