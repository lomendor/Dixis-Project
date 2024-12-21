import express from 'express';
import producerRoutes from './producerRoutes';
import reviewRoutes from './reviewRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Producer routes
router.use('/producers', producerRoutes);

// Review routes
router.use('/reviews', reviewRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router; 