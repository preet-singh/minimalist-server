'use strict';
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';
process.env.JWT_SECRET = 'secret';


require('dotenv').config();

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || 'postgresql://dunder_mifflin@localhost/minimalist_test';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;