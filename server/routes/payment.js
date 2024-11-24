import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;