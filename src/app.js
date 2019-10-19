'use strict';
//IMPORTS
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
//const validateBearerToken = require('./bin/validate-bearer-token');
const errorHandler = require('./bin/error-handler');
const inventoryRouter = require('../src/inventory /inventory-router');
const itemsRouter = require('../src/items/items-router');
const authRouter = require('../src/auth/auth-router');
const usersRouter = require('../src/users/users-router');


//INITIALIZATION
const app = express();

//MIDDLEWARE
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
//app.use(validateBearerToken());

//ROUTES
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});
app.use('/api/inventory', inventoryRouter);
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

//ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error('Path Not Found');
  error.status = 404;
  next(error); 
});
app.use(errorHandler);

module.exports = app;

