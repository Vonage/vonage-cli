import chalk from 'chalk';

/**
 * Shared chalk formatter for primitive values.
 *
 * @param { any } val - The value to format
 * @returns { string } - The chalk-formatted string
 */
export const formatValue = (val) => {
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
};
