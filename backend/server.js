import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/db.js';
import globalErrorHandler from './middleware/errorHandler.js';

import AuthRouter from './routes/auth.js';
import ThreadRouter from './routes/thread.js';
import ChatRouter from './routes/chat.js';
import ShareRouter from './routes/share.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize App
const initApp = async () => {
  try {
    await connectDatabase();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.get('/', (req, res) => res.send('Backend is running automatically'));
    app.use('/auth', AuthRouter);
    app.use('/threads', ThreadRouter);
    app.use('/chat', ChatRouter);
    app.use('/share', ShareRouter);

    // Global Error Handler
    app.use(globalErrorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

initApp();
