import { Router } from 'express';
import { login, register } from '../controllers/auth';
import validators, { validate } from '../utils/validator';

const router = Router();

// Register endpoint
router.post(
  '/register',
  validators.register,
  validate,
  register,
);

// Login endpoint
router.post(
  '/login',
  validators.login,
  validate,
  login,
);

export default router;
