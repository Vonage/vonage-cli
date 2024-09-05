const chalk = require('chalk');

const dumpKey = (key) => `${chalk.bold(key)}`;

const dumpValue = (value) => {
  const varType = Array.isArray(value) ? 'array' : typeof value;

  if (value === undefined || value === null) {
    return `${chalk.dim.yellow('Not Set')}`;
  }

  switch (varType) {
  case 'number':
    return `${chalk.dim(value)}`;

  case 'array':
    return dumpArray(value);

  case 'object':
    return dumpObject(value);

  case 'string':
    // falls through
  default:
    return `${chalk.blue(value)}`;
  }
};

const dumpObject = (
  data,
  indent = 2,
) => [
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


const dumpArray = (data, indent = 2) => [
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
        value,
        indent + 2,
      ).trimStart()}`;

    default:
      return `${' '.repeat(indent)}${dumpValue(value)}`;
    }
  }),
  `${' '.repeat(indent - 2)}${chalk.yellow(']')}`,
].join('\n');

exports.dumpKey = dumpKey;

exports.dumpValue = dumpValue;

exports.dumpObject = dumpObject;

exports.dumpArray = dumpArray;
