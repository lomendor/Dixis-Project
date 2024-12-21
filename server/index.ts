import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { Router } from 'express';

const app = express();

// Basic middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || '']
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 
     'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 
     'http://localhost:5179', 'http://localhost:5180'];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions) as RequestHandler);
app.use(express.json({ limit: '10kb' }) as RequestHandler);
app.use(cookieParser() as RequestHandler);

// Routes
const setupRoutes = async () => {
  const authRoutes = (await import('./routes/auth')).default;
  const productRoutes = (await import('./routes/products')).default;
  const categoryRoutes = (await import('./routes/categories')).default;
  const permissionsRoutes = (await import('./routes/permissions')).default;
  const adminRoutes = (await import('./routes/admin')).default;

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/permissions', permissionsRoutes);
  app.use('/api/admin', adminRoutes);
};

// Error handling
interface CustomError extends Error {
  status?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};

app.use(errorHandler as express.ErrorRequestHandler);

const startServer = async () => {
  try {
    await setupRoutes();
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dixis');
    console.log('Connected to MongoDB');

    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;