import chalk from 'chalk';
import { descriptionDetail } from './descriptionList.js';
import { formatValue } from './formatValue.js';

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
  detailFormatter: formatValue,
});

/**
 * Formats an object into a string representation
 *
 * @param { Object } data - The object to format
 * @returns { string } - The formatted string
 */
const dumpObject = dumpValue;

/**
 * Formats an array into a string representation
 *
 * @param { Array<any> } data - The array to format
 * @returns { string } - The formatted string
 */
const dumpArray = dumpValue;

/**
 * Formats a command string using a common style
 * @param { string } command - The command to print
 * @returns { string } - The formatted string
 */
const dumpCommand = (command) => chalk.green(command);

export { dumpKey, dumpValue, dumpObject, dumpArray, dumpCommand };
