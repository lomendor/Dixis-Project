import express, { Request, Response } from 'express';
import { isAuth, isAdmin } from '../middleware/auth';

const router = express.Router();

// Προσωρινά θα επιστρέφουμε ένα απλό μήνυμα
router.get('/', isAuth, (req: Request, res: Response) => {
  res.json({ message: 'Categories route - Coming soon' });
});

export default router;
