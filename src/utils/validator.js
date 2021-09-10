import { body, validationResult } from 'express-validator';
import sampleResponse from './response';

// middleware to return validation errors
export const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const response = sampleResponse(400, 'Validation error', null, { errors: result })
    return res.status(response.status).json(response);
  }

  return next()
};

const validators = { 
  register: [
    body('email')
      .not()
      .isEmpty()
      .withMessage('email field cannot be empty')
      .isString()
      .isEmail()
      .withMessage('Should be an email address')
      .toLowerCase(),
    body('name')
      .not()
      .isEmpty()
      .withMessage('name field cannot be empty')
      .isString()
      .isLength({ min: 2, max: 20 })
      .withMessage('Length should range between 2 and 20 characters'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('password field cannot be empty')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Should be 8 or more characters')
  ],
  login: [
    body('email')
      .not()
      .isEmpty()
      .withMessage('email field cannot be empty')
      .isString()
      .isEmail()
      .withMessage('Should be an email address')
      .toLowerCase(),
    body('password')
      .not()
      .isEmpty()
      .withMessage('password field cannot be empty')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Should be 8 or more characters')
  ],
  sendMoney: [
    body('to')
      .not()
      .isEmpty()
      .withMessage('to field cannot be empty')
      .isString()
      .isEmail()
      .withMessage('Should be an email address'),
    body('amount')
      .not()
      .isEmpty()
      .withMessage('amount field cannot be empty')
      .isNumeric()
      .withMessage('Should be numeric')
  ],
  addBeneficiary: [
    body('bankCode')
      .not()
      .isEmpty()
      .withMessage('bankCode field cannot be empty')
      .isNumeric()
      .withMessage('Should be numeric'),
    body('accountNumber')
      .not()
      .isEmpty()
      .withMessage('accountNumber field cannot be empty')
      .isNumeric()
      .withMessage('Should be numeric')
  ],
  getPaymentModal: [
    body('amount')
      .not()
      .isEmpty()
      .withMessage('amount field cannot be empty')
      .isNumeric()
      .withMessage('Can only contain numbers')
  ],
  withdraw: [
    body('amount')
      .not()
      .isEmpty()
      .withMessage('amount field cannot be empty')
      .isNumeric()
      .withMessage('Can only contain numbers'),
    body('beneficiaryId')
      .not()
      .isEmpty()
      .withMessage('beneficiaryId field cannot be empty')
  ]
};

export default validators;
