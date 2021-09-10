import db from '../models';
import { createRecipient, getBanks, initiateTransfer, resolveAccount } from '../utils/paystack';
import sampleResponse from '../utils/response';
const { Transaction, Beneficiary, User } = db;

export const createTransaction = async (req, res, next) => {
  try {
    const { email } = req.user;
    const {
      to,
      amount
    } = req.body;

    const userExists = await User.doesUserExist(to);

    if (!userExists) {
      throw new Error('There is no user with the specified email address');
    }

    if (email === to) {
      throw new Error('You can not send money to yourself');
    }

    const transaction = await Transaction.create({
      from: email,
      to,
      amount: parseFloat(amount),
    });

    const response = sampleResponse(200, 'Your transfer is being processed', { transaction: transaction.dataValues });
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

export const withdraw = async (req, res, next) => {
 try {
  const { _id } = req.user;
  const {
    beneficiaryId,
    amount
  } = req.body;

  const beneficiary = await Beneficiary.findOne({
    where: {
      _id: beneficiaryId
    }
  });

  if (!beneficiary) {
    throw new Error('Beneficiary not found');
  }

  // compare amount with balance
  const user = await User.findOne({
    where: {
      _id,
    }
  });

  if (!user) {
    throw new Error('Please login')
  }

  if (parseFloat(user.amount) < parseFloat(amount)) {
    throw new Error('Insufficient balance');
  }

  const {
    accountName,
    accountNumber,
    bankCode,
  } = beneficiary.dataValues;

  const recipientCode = await createRecipient({
    accountNumber,
    bankCode
  });
  
  const transfer = await initiateTransfer({
    amount,
    recipient: recipientCode
  });

  if (transfer.status !== true) {
    throw new Error(transfer.message);
  }

  const response = sampleResponse(200, 'Withdrawal is being processed');
  return res.status(response.status).json(response);
 } catch (error) {
   return next(error);
 }
};

export const addBeneficiary = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const {
      bankCode,
      accountNumber
    } = req.body;

    // first verify bank before adding
    const bankDetails = await resolveAccount({
      accountNumber,
      bankCode
    });

    if (bankDetails.status !== true) {
      throw new Error('Bank not valid');
    }

    const { account_number , account_name: accountName } = bankDetails.data;

    const beneficiary = await Beneficiary.create({
      bankCode,
      accountName,
      accountNumber: account_number, 
      userId: _id,
    });

    const response = sampleResponse(200, 'Beneficiary added', {
      beneficiary: {
        ...beneficiary.dataValues,
        userId: undefined,
      }
    });
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

export const getAvailableBanks = async (req, res, next) => {
  try {
    const data = await getBanks();
    
    const response = sampleResponse(200,  'Banks fetched', data);
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

