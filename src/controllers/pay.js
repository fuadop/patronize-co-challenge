const supportedEvents = Object.freeze({
  TRANSACTION_SUCCESSFUL: 'charge.success',
  TRANSFER_SUCCESSFUL: '',
  TRANSFER_FAILED: '',
  TRANSFER_REVERSED: '',
});

export const getPaymentScreen = (req, res, next) => {

};

export const verifyPayment = (req, res, next) => {
  const { event } = req.body;

  switch(event) {
    case supportedEvents.TRANSACTION_SUCCESSFUL:
      // Do something
    case supportedEvents.TRANSFER_SUCCESSFUL:
      // Do another thing
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
};
