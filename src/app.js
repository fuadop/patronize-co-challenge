import '@babel/polyfill';

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from './models';
import { verifyUser } from './middlewares/auth';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import payRouter from './routes/pay';
import transactionsRouter from './routes/transactions';
import sampleResponse from './utils/response';

const debug = require('debug')('patronize-co-challenge:server');
const app = express();

// Connect to db
(async () => {
  await db.sequelize.authenticate();
  await db.sequelize.sync({
    alter: true,
    logging: false,
  });

  debug('Database connection established');
})();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/pay', payRouter);
app.use(verifyUser);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/transaction', transactionsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const response = sampleResponse(500, 'Error', null, err.message);
  console.log(err);
  return res.status(response.status).json(response);
});

module.exports = app;
