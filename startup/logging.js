const winston = require('winston');
const { format, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;

require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle([
    new transports.File({ filename: 'exceptions.log' }),
    new transports.Console({ colorize: true, prettyPrint: true })
  ]);

  process.on('unhandledRejection', ex => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({
      level: 'debug',
      format: combine(
        format.colorize(),
        format.align(),
        timestamp({
          format: 'MM-DD HH:mm:ss'
        }),
        format.printf(
          info => `${info.timestamp} [${info.level}] ${info.message}`
        )
      )
    })
  );

  winston.add(
    new winston.transports.File({
      filename: 'combined.log',
      level: 'info',
      format: combine(
        format.colorize(),
        format.align(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        prettyPrint(),
        format.printf(
          info => `${info.timestamp} [${info.level}] ${info.message}`
        )
      )
    })
  );

  winston.add(
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: combine(
        format.colorize(),
        format.align(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        prettyPrint(),
        format.printf(
          info => `${info.timestamp} [${info.level}] ${info.message}`
        )
      )
    })
  );
};
