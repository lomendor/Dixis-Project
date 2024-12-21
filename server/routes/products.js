import express from 'express';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Products route - Coming soon' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 