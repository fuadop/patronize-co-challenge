import { Router } from 'express';
import { getUserDetails, getUserTransactions } from '../controllers/users';
import validators, { validate } from '../utils/validator';

const router = Router();

// Get user details endpoint
router.get(
  '/',
  getUserDetails,
);

// get user transactions endpont
router.get(
  '/transactions',
  getUserTransactions,
);

export default router;
