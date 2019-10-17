const express = require('express');
const users = require('../routes/users');
const login = require('../routes/login');
const register = require('../routes/register');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/login', login);
  app.use('/api/register', register);
  app.use(error);
};
