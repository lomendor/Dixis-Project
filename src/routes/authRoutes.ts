import express from 'express';
import {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
} from '../controllers/authController';
import { isAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/refresh-token', isAuth, refreshToken);
router.post('/logout', isAuth, logout);

export default router; 