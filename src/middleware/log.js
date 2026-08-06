import chalk from 'chalk';
import console from 'console';
import winston from 'winston';
import { table } from '../ux/table.js';
import { getSettings } from '../utils/settings.js';

const settings = getSettings();
const { format, transports } = winston;

const warning = (message) => process.stderr.write(`${chalk.yellow('Warning')}: ${message}\n`);

const error = (message) => process.stderr.write(`${chalk.red('Error')}: ${message}\n`);

export const setupLog = (argv) => {
  const color = argv.noColor ? settings['color'] : true;
  let level = 'emerg';
  if (argv.verbose) {
    level = 'info';
  }

  if (argv.debug) {
    level = 'debug';
  }

  const logger = winston.createLogger({
    level: level,
    format:
      format.combine(
        color ? format.colorize() : undefined,
        format.padLevels(),
        format.simple(),
      ),
    // TODO Add debug file like fly.io
    transports: [new transports.Console()],
  });

  global.console.info = (...args) => logger.info(...args);
  global.console.warn = (...args) => {
    warning(args[0]);
    logger.warn(...args);
  };

  global.console.error = (...args) => {
    error(args[0]);
    logger.error(...args);
  };
  global.console.debug = (...args) => logger.debug(...args);
  global.console.table = (...args) => console.log(table(...args));

  return {
    logger: logger,
  };
};
