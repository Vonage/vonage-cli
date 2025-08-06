const chalk = require('chalk');
const { descriptionDetail } = require('./descriptionList');

const dumpKey = (key) => chalk.bold(String(key));

/**
 * Formats a value using chalk styles.
 *
 * @param { any } value - The value to format
 * @returns { string } - The chalk-formatted string
 */
const dumpValue = (value) => descriptionDetail(value, '', {
  indent: 2,
  recursive: false,
  detailFormatter: (val) => {
    if (val === undefined || val === null) {
      return chalk.dim.yellow('Not Set');
    }

    const type = Array.isArray(val) ? 'array' : typeof val;

    switch (type) {
    case 'number':
    case 'bigint':
      return chalk.dim(String(val));
    case 'string':
    default:
      return chalk.blue(val);
    }
  },
});

/**
 * Formats an object into a string representation
 *
 * @param { Object } data - The object to format
 * @param { number } indent - Starting indentation level
 * @returns { string } - The formatted string
 */
const dumpObject = dumpValue;

/**
 * Formats an array into a string representation
 *
 * @param { Array<any> } data - The array to format
 * @param { number } indent - Starting indentation level
 * @returns { string } - The formatted string
 */
const dumpArray = dumpValue;

/**
 * Formats a command string using a common style
 * @param { string } command - The command to print
 * @returns { string } - The formmated string
 */
const dumpCommand = (command) => chalk.green(command);

module.exports = {
  dumpKey,
  dumpValue,
  dumpObject,
  dumpArray,
  dumpCommand,
};

