import { Router } from 'express';
import {
  createTransaction,
  withdraw, 
  addBeneficiary,
} from '../controllers/transactions';

const router = Router();

// Create transaction endpont
router.post('/create', createTransaction);
// withdraw endpoint
router.post('/withdraw', withdraw);
// Add beneficiary endpont
router.post('/add-beneficiary', addBeneficiary);

export default router;
