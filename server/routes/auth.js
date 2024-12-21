import express from 'express';
import { authLimiter } from '../middleware/security.js';
import { isAuth } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile
} from '../controllers/authController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Token generation functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Public routes
router.post('/register', register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/logout', logout);

// Protected routes
router.use(isAuth);
router.get('/me', getMe);
router.put('/update-password', updatePassword);
router.put('/update-profile', updateProfile);

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