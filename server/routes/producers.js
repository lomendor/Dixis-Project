import express from 'express';
import { isAuth, isAdmin } from '../middleware/auth.js';
import {
  getProducers,
  getProducer,
  createProducer,
  updateProducer,
  deleteProducer
} from '../controllers/producerController.js';

const router = express.Router();

// Get all producers
router.get('/', isAuth, getProducers);

// Get single producer
router.get('/:id', isAuth, getProducer);

// Create producer (Admin only)
router.post('/', isAuth, isAdmin, createProducer);

// Update producer (Admin only)
router.put('/:id', isAuth, isAdmin, updateProducer);

// Delete producer (Admin only)
router.delete('/:id', isAuth, isAdmin, deleteProducer);

export default router; 