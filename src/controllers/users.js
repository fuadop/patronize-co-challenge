import { Op } from 'sequelize';
import db from '../models';
import sampleResponse from '../utils/response';
const { User, Transaction } = db;

export const getUserDetails = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findOne({
      where: {
        _id,
      },
      exclude: ['_id', 'password'],
      include: 'beneficiaries',
    });
    
    if (!user) {
      throw new Error('User not found, please re-login');
    }

    const response = sampleResponse(200, 'User details fetched', {
      ...user.dataValues,
      _id: undefined,
      password: undefined,
    });
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

export const getUserTransactions = async (req, res, next) => {
 try {
  const { email } = req.user;

  const transactions = await Transaction.findAll({
    where: {
     [Op.or]: [
       {
         from: email
       },
       {
         to: email
       }
     ] 
    }
  });

  const response = sampleResponse(200, 'Transactions fetched', { transactions: transactions.map(t => t.dataValues) });
  return res.status(response.status).json(response);
 } catch (error) {
   return next(error);
 }
};
