const winston = require('winston');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

require('express-async-errors');
require('./startup/logging')();
require('./startup/prod')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
