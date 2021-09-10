import { supportedEvents, initializeTransaction, _toNaira } from "../utils/paystack";
import sampleResponse from "../utils/response";
import db from "../models";
const { User, Beneficiary } = db;

// REturn paystack screen to make payment
export const getPaymentScreen = async (req, res, next) => {
  try {
    const { email } = req.user;

    const { amount } = req.body;

    // Return url from paystack for payment
    const data = await initializeTransaction({
      email,
      amount: parseFloat(amount),
      channels: ['card', 'bank']
    });
    
    const response = sampleResponse(200, 'Payment url generated', data);
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

// This would fund the user account based on the metadata passed
// A user email should be passed as metadata
export const verifyPayment = async (req, res, next) => {
  try {
    const { event } = req.body;

    switch(event) {
      case supportedEvents.TRANSACTION_SUCCESSFUL:
        // add to user balance
        const { email } = req.body.data.customer;
        
        const user = await User.findOne({
          where: {
            email
          }
        });
        
        if (user) {
          user.balance += _toNaira(req.body.data.amount)
          await user.save();
        }

        break;
      case supportedEvents.TRANSFER_SUCCESSFUL:
        // Do another thing
        const { amount } = req.body.data;
        const accountNumber = req.body.recipient.details.account_number;

        // Find user with the account number and deduct their balance
        const beneficiary = await Beneficiary.findOne({
          where: {
            accountNumber,
          },
          include: 'user'
        });
       
        if (beneficiary) {
          const userId = beneficiary.user._id;

          const user = await User.findOne({
            where: {
              _id: userId
            }
          });

          if (user) {
            user.balance -= _toNaira(amount);
            await user.save();
          }
        }

        break;
      case supportedEvents.TRANSFER_FAILED:
        // Do something else
      case supportedEvents.TRANSFER_REVERSED: 
        // Do another thing
      default:
        // Fallback case
    };

    console.log(req.body);
    // Webhook must return 200
    res.status(200).send('Event received');
  } catch (error) {
    return next(error);
  }
};
