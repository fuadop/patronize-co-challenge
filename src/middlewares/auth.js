require('dotenv').config();
import jwt from 'jsonwebtoken';
import sampleResponse from '../utils/response';

export const verifyUser = (req, res, next) => {
  const bearerAuth = req.header('Authorization');

  if (!bearerAuth || bearerAuth === '') {
    const response = sampleResponse(400, 'Unauthorized action. Log in');
    return res.status(response.status).json(response);
  }

  const token = bearerAuth.split(' ')[1];

  if (!token) {
    const response = sampleResponse(400, 'Unauthorized action. Log in');
    return res.status(response.status).json(response);
  }

  // Verify token with jwt.
  const data = jwt.verify(token, process.env.JWT_SECRET);
  req.user = data;
  res.locals.user = user;

  return next();
};
