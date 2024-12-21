import express from 'express';
import type { RequestHandler } from 'express-serve-static-core';
import { authLimiter } from '../middleware/security';
import { isAuth } from '../middleware/auth';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  generateToken,
  generateRefreshToken
} from '../controllers/authController';
import {
  RegisterRequest,
  LoginRequest,
  AuthenticatedRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest
} from '../../src/types/controllers/auth.types';

const router = express.Router();

// Public routes
router.post('/register', register as unknown as RequestHandler);
router.post('/login', authLimiter as unknown as RequestHandler, login as unknown as RequestHandler);
router.post('/forgot-password', forgotPassword as unknown as RequestHandler);
router.put('/reset-password/:token', resetPassword as unknown as RequestHandler);
router.post('/logout', logout as unknown as RequestHandler);

// Protected routes
router.use(isAuth as unknown as RequestHandler);
router.get('/me', getMe as unknown as RequestHandler);
router.put('/update-password', updatePassword as unknown as RequestHandler);
router.put('/update-profile', updateProfile as unknown as RequestHandler);

// Google OAuth routes - Προσωρινά απενεργοποιημένα
/*
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Επιτυχής σύνδεση
    const token = generateToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    
    // Επιστροφή στο frontend με τα tokens
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
  }
);
*/

export default router;