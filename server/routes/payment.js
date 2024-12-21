import express from 'express';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// Προσωρινά θα επιστρέφουμε ένα απλό μήνυμα
router.get('/', isAuth, (req, res) => {
  res.json({ message: 'Payment route - Coming soon' });
});

export default router;