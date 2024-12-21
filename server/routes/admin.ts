import express from 'express';
import { getStats } from '../controllers/adminController';
import { isAuth, isAdmin } from '../middleware/auth';

const router = express.Router();

// Stats
router.get('/stats', isAuth, isAdmin, getStats);

export default router;
