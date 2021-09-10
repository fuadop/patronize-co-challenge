require('dotenv').config();

import axios from 'axios';

export const supportedEvents = Object.freeze({
  TRANSACTION_SUCCESSFUL: 'charge.success',
  TRANSFER_SUCCESSFUL: 'transfer.success',
  TRANSFER_FAILED: 'transfer.failed',
  TRANSFER_REVERSED: 'transfer.reversed',
});

const endpoints = Object.freeze({
  INITIALIZE_TRANSACTION: 'https://api.paystack.co/transaction/initialize',
  RESOLVE_BANK: 'https://api.paystack.co/bank/resolve',
  GET_BANKS: 'https://api.paystack.co/bank?country=nigeria&perPage=100',
  CREATE_TRANSFER_RECIPIENT: 'https://api.paystack.co/transferrecipient',
  INITIATE_TRANSFER: 'https://api.paystack.co/transfer' 
});

const _toKobo = (amountInNaira) =>
  amountInNaira * 100;

export const _toNaira = (amountInKobo) => 
  amountInKobo / 100;

export const initializeTransaction = async (config) => {
  config.amount = _toKobo(config.amount);
  const { data } = await axios({
    url: endpoints.INITIALIZE_TRANSACTION,
    method: 'POST',
    data: config,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
  });

  return data;
};

export const getBanks = async () => {
  const { data } = await axios({
    url: endpoints.GET_BANKS,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
  });

  return data; 
};

export const resolveAccount = async ({ accountNumber, bankCode }) => {
  const { data } = await axios({
    url: endpoints.RESOLVE_BANK + `?account_number=${accountNumber}&bank_code=${bankCode}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
  });

  return data; 
};

export const createRecipient = async ({
  name,
  accountNumber,
  bankCode
}) => {
  const { data } = await axios({
    url: endpoints.CREATE_TRANSFER_RECIPIENT,
    method: 'POST',
    data: {
      type: 'nuban',
      name,
      account_number: accountNumber,
      bank_code: bankCode,
    },
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
  });

  // return the code needed
  return data.data.recipient_code;
};

/**
 * 
 * @param {Object}  param0 - Object 
 * @param {Number} amount - Amount to transfer
 * @param {String} recipient - Recipient code generated from createRecipient function. 
 */
export const initiateTransfer = async ({ amount, recipient }) => {
  const { data } = await axios({
    url: endpoints.INITIATE_TRANSFER,
    method: 'POST',
    data: {
      source: 'balance',
      amount: _toKobo(amount),
      recipient,
      reason: 'Withdrawal'
    },
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
  });

  return data;
};
