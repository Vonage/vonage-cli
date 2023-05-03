import chalk from 'chalk';
import debug from 'debug';

const log = debug('vonage:cli:ux');

export const objectDump = (data: unknown, indent = 2): Array<string> =>
  Object.entries(data)
    .map(([key, value]) => {
      const varType = Array.isArray(value) ? 'array' : typeof value;
      if (value === undefined || value === null) {
        return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpValue(value)}`;
      }

      switch (varType) {
      case 'object':
        log('recurision');
        return [
          `${' '.repeat(indent)}${dumpKey(key)}: ${chalk.yellow('{')}`,
          objectDump(value, indent + 2),
          `${' '.repeat(indent)}${chalk.yellow('}')}`,
        ];

      case 'array':
        log('array');
        return [
          `${' '.repeat(indent)}${dumpKey(key)}: ${chalk.yellow('[')}`,
          ...dumpArray(value, indent + 2),
          `${' '.repeat(indent)}${chalk.yellow(']')}`,
        ];

      default:
        log('normal');
        return `${' '.repeat(indent)}${dumpKey(key)}: "${dumpValue(value)}"`;
      }
    })
    .flat();

export const dumpArray = (data: Array<unknown>, indent = 2) =>
  data.map((value) => {
    const varType = Array.isArray(value) ? 'array' : typeof value;
    switch (varType) {
    case 'object':
      return [
        `${' '.repeat(indent)}${chalk.yellow('{')}`,
        objectDump(value, indent + 2),
        `${' '.repeat(indent)}${chalk.yellow('}')}`,
      ].join('\n');
    case 'array':
      return [
        `${' '.repeat(indent)}${chalk.yellow('[')}`,
        dumpArray(value as Array<unknown>, indent + 2).join('\n'),
        `${' '.repeat(indent)}${chalk.yellow(']')}`,
      ].join('\n');

    default:
      return `${' '.repeat(indent)}"${dumpValue(value)}"`;
    }
  });

export const dumpValue = (
  value: Array<unknown> | string | number | unknown,
): string => {
  const varType = Array.isArray(value) ? 'array' : typeof value;

  if (value === undefined || value === null) {
    log('Value not set');
    return `${chalk.dim.yellow('Not Set')}`;
  }

  switch (varType) {
  case 'number':
    log('Dumping number');
    return `${chalk.dim(value)}`;

  case 'string':
    log('Dumping string');
    return `${chalk.blue(value)}`;

  case 'array':
    return dumpArray(value as Array<unknown>);
  case 'object':
    log('Dumping object');
    return outputColorJson(value);

  default:
    log('Just dumping');
    return `${chalk.blue(value)}`;
  }
};

export const dumpKey = (key: string): string => `"${chalk.bold(key)}"`;

export const outputColorJson = (data: unknown): string =>
  [chalk.yellow('{'), ...objectDump(data).flat(), chalk.yellow('}')].join('\n');

export default (flags) => ({
  dumpKey,
  dumpArray,
  dumpValue,
  outputColorJson,
  truncate: (value: string, length = 25): string => {
    return flags.truncate && `${value}`.length > length
      ? value.substring(0, length) + chalk.dim(' ...truncated')
      : dumpValue(value);
  },
  objectDump,
});
