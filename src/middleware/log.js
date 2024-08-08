const winston = require('winston');
const { format, transports } = winston;

exports.setupLog = async (argv) => {
  let level = 'notice';
  if (argv.verbose) {
    level = 'info';
  }

  if (argv.debug) {
    level = 'debug';
  }

  const logger = winston.createLogger({
    level: level,
    format: format.combine(
      format.timestamp(),
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

  return {
    logger: logger,
  };
};
