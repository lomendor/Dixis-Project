import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import {
  getStats,
  getPendingApplications,
  reviewApplication,
  getUsers,
  updateUser,
  getOrders,
  updateOrder,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/admin';

const router = express.Router();

// Apply admin authentication to all routes
router.use(adminAuth);

// Dashboard & Stats
router.get('/stats', getStats);

// Producer Management
router.get('/producers/pending', getPendingApplications);
router.post('/producers/:id/review', reviewApplication);

// User Management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

// Order Management
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrder);

// Content Management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

export default router;