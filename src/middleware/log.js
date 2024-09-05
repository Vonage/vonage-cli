const console = require('console');
const winston = require('winston');
const { table } = require('../ux/table');
const { format, transports } = winston;

exports.setupLog = (argv) => {
  let level = 'warn';
  if (argv.verbose) {
    level = 'info';
  }

  if (argv.debug) {
    level = 'debug';
  }

  const logger = winston.createLogger({
    level: level,
    format: format.combine(
      format.colorize(),
      format.padLevels(),
      format.simple(),
    ),
    // TODO Add debug file like fly.io
    transports: [new transports.Console()],
  });

  global.console.info = (...args) => logger.info(...args);
  global.console.warn = (...args) => logger.warn( ...args);
  global.console.error = (...args) => logger.error( ...args);
  global.console.debug = (...args) => logger.debug( ...args);
  global.console.table = (...args) => console.log(table(...args));

  return {
    logger: logger,
  };
};
