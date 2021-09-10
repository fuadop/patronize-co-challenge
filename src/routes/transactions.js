import { Router } from 'express';
import {
  createTransaction,
  withdraw, 
  addBeneficiary,
  getAvailableBanks,
} from '../controllers/transactions';
import validators, { validate } from '../utils/validator';

const router = Router();

// Create transaction endpont
router.post(
  '/send-money',
  validators.sendMoney,
  validate,
  createTransaction,
);
// withdraw endpoint
router.post(
  '/withdraw',
  validators.withdraw,
  validate,
  withdraw,
);
// Add beneficiary endpont
router.post(
  '/add-beneficiary',
  validators.addBeneficiary,
  validate,
  addBeneficiary,
);

router.get(
  '/available-banks',
  getAvailableBanks,
);

export default router;
