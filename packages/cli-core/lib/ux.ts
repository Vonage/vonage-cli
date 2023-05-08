import chalk from 'chalk';

const flags = { truncate: true };

const dumpObject = (data: unknown, indent = 2): string =>
  [
    `${' '.repeat(indent - 2)}${chalk.yellow('{')}`,
    ...Object.entries(data).map(([key, value]) => {
      if (value === undefined || value === null) {
        return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpValue(value)}`;
      }

      const varType = Array.isArray(value) ? 'array' : typeof value;
      switch (varType) {
      case 'object':
        return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpObject(
          value,
          indent + 2,
        ).trimStart()}`;

      case 'array':
        return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpArray(
          value,
          indent + 2,
        ).trimStart()}`;

      default:
        return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpValue(value)}`;
      }
    }),
    `${' '.repeat(indent - 2)}${chalk.yellow('}')}`,
  ].join('\n');

const dumpArray = (data: Array<unknown>, indent = 2): string =>
  [
    `${' '.repeat(indent - 2)}${chalk.yellow('[')}`,
    ...data.map((value) => {
      if (value === undefined || value === null) {
        return `${' '.repeat(indent)}${dumpValue(value)}`;
      }

      const varType = Array.isArray(value) ? 'array' : typeof value;
      switch (varType) {
      case 'object':
        return `${' '.repeat(indent)}${dumpObject(
          value,
          indent + 2,
        ).trimStart()}`;

      case 'array':
        return `${' '.repeat(indent)}${dumpArray(
            value as Array<unknown>,
            indent + 2,
        ).trimStart()}`;

      default:
        return `${' '.repeat(indent)}${dumpValue(value)}`;
      }
    }),
    `${' '.repeat(indent - 2)}${chalk.yellow(']')}`,
  ].join('\n');

const dumpKey = (key: string): string => `${chalk.bold(key)}`;

export const dumpValue = (
  value: Array<unknown> | string | number | unknown,
): string => {
  const varType = Array.isArray(value) ? 'array' : typeof value;

  if (value === undefined || value === null) {
    return `${chalk.dim.yellow('Not Set')}`;
  }

  switch (varType) {
  case 'number':
    return `${chalk.dim(value)}`;

  case 'array':
    return dumpArray(value as Array<unknown>);

  case 'object':
    return dumpObject(value);

  case 'string':
    // falls through
  default:
    return `${chalk.blue(value)}`;
  }
};

export const truncateString = (value: string, length = 25): string =>
  flags.truncate && `${value}`.length > length
    ? dumpValue(value.substring(0, length)) + chalk.dim(' ...value truncated')
    : dumpValue(value);
