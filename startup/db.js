const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const db = config.get('database');
  const settings = config.get('settings');
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(db, settings)
    .then(() => winston.info('Connected to MongoDB...'));
};
