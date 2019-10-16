'use strict';
//IMPORTS
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./bin/validate-bearer-token');
const errorHandler = require('./bin/error-handler');

//INITIALIZATION
const app = express();

//MIDDLEWARE
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken());

//ROUTES
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

//ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error('Path Not Found');
  error.status = 404;
  next(error); 
});
app.use(errorHandler);

module.exports = app;

