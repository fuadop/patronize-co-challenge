import { Router } from 'express';
import { getPaymentScreen, verifyPayment } from '../controllers/pay';
import { verifyUser } from '../middlewares/auth';
import validators, { validate } from '../utils/validator';

const router = Router();

// Get payment screen endpoint
// The screen would be used to make payments
// with bank or card
router.post(
  '/modal',
  verifyUser,
  validators.getPaymentModal,
  validate,
  getPaymentScreen,
);

// Webhook to verify transactions
router.post('/verify', verifyPayment);

export default router;
