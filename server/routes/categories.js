import express from 'express';
import { isAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Προσωρινά θα επιστρέφουμε ένα απλό μήνυμα
router.get('/', isAuth, (req, res) => {
  res.json({ message: 'Categories route - Coming soon' });
});

export default router; 