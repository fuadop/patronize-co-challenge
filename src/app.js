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

const debug = require('debug')('patronize-co-challenge:server');
const app = express();

// Connect to db
(async () => {
  await db.sequelize.authenticate();
  await db.sequelize.sync({
    alter: true
  });

  debug('Database connection established');
})();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set the app env
app.set('env', process.env.NODE_ENV);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use(verifyUser);
app.use('/users', usersRouter);
app.use('/pay', payRouter);
app.use('/transaction', transactionsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
