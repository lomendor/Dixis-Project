import { Router } from 'express';
import { isAuth, isAdmin } from '../middleware';
import { getStats, assignProducerToSeller } from '../controllers/adminController';
import {
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

const router = Router();

// Apply admin authentication to all routes
router.use(isAuth, isAdmin);

// Dashboard & Stats
router.get('/stats', getStats);

// Producer Management
router.post('/assign-producer', assignProducerToSeller);
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