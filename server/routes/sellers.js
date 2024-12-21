import express from 'express';
import { isAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Προσωρινά θα επιστρέφουμε ένα απλό μήνυμα
router.get('/', isAuth, isAdmin, (req, res) => {
  res.json({ message: 'Sellers route - Coming soon' });
});

export default router; 