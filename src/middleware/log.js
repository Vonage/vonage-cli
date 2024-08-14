const winston = require('winston');
const { table } = require('../ux/table');
const { format, transports } = winston;

exports.setupLog = async (argv) => {
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

  console.info = (...args) => logger.info.call(logger, ...args);
  console.warn = (...args) => logger.warn.call(logger, ...args);
  console.error = (...args) => logger.error.call(logger, ...args);
  console.debug = (...args) => logger.debug.call(logger, ...args);
  console.table = (...args) => console.log(table(...args));

  return {
    logger: logger,
  };
};
