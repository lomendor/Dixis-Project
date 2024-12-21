import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { isAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Stats
router.get('/stats', isAuth, isAdmin, getStats);

export default router; 