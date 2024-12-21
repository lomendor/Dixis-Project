import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Δεν έχετε συνδεθεί' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Ο χρήστης δεν βρέθηκε' });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Μη έγκυρο token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Δεν έχετε δικαίωμα πρόσβασης' });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Δεν έχετε δικαίωμα πρόσβασης' });
  }
};

export const isProducer = (req, res, next) => {
  if (req.user && (req.user.role === 'producer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Δεν έχετε δικαίωμα πρόσβασης' });
  }
};