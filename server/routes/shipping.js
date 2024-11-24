import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  calculateShippingRates,
  createShipment,
  getTrackingInfo,
  generateLabel,
} from '../controllers/shipping.js';

const router = express.Router();

router.post('/rates', auth, calculateShippingRates);
router.post('/shipments', auth, createShipment);
router.get('/tracking/:provider/:trackingNumber', getTrackingInfo);
router.get('/labels/:provider/:shipmentId', auth, generateLabel);

export default router;