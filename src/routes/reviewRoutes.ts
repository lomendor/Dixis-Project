import express from 'express';
import {
  createReview,
  getProducerReviews,
  updateReviewStatus,
  getReviewStatistics
} from '../controllers/reviewController';
import { isAuth, isAdmin } from '../middleware';

const router = express.Router();

// Public routes
router.get('/producer/:producerId', getProducerReviews);
router.get('/producer/:producerId/stats', getReviewStatistics);

// Protected routes (απαιτείται σύνδεση)
router.post('/', isAuth, createReview);

// Admin routes
router.patch('/:reviewId/status', isAuth, isAdmin, updateReviewStatus);

export default router; 