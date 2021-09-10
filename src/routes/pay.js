import { Router } from 'express';
import { getPaymentScreen, verifyPayment } from '../controllers/pay';

const router = Router();

// Get payment screen endpoint
// The screen would be used to make payments
// with bank or card
router.get('/modal', getPaymentScreen);

// Webhook to verify transactions
router.post('/verify', verifyPayment);

export default router;
