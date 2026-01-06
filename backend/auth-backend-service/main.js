require('dotenv').config();
require('express-async-errors');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { logger } = require('../internal/common/logger');
const { errorHandler } = require('../internal/common/error-handler');
const authRoutes = require('../internal/api/routes/auth.routes');
const userRoutes = require('../internal/api/routes/user.routes');
const adminRoutes = require('../internal/api/routes/admin.routes');

const app = express();

// Middleware
app.use(helmet());

app.use(cors({
  origin: ['https://universal-helpers-j1p7-p6jdjsxte-sakshi-anands-projects.vercel.app'],
  credentials: true,
}))
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.status(200).json({msg: "Hello World!!!!!!"})
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/auth-service';
    await mongoose.connect(mongoUrl);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;