import chalk from 'chalk';

// eslint-disable-next-line max-len
export const objectDump = (data: unknown, indent = 2): Array<string> =>
  Object.entries(data)
    .map(([key, value]) => {
      const varType = Array.isArray(value) ? 'array' : typeof value;
      switch (varType) {
      case 'object':
        return [
          `${' '.repeat(indent)}${dumpKey(key)}: ${chalk.yellow('{')}`,
          objectDump(value, indent + 2),
          `${' '.repeat(indent)}${chalk.yellow('}')}`,
        ];
      case 'array':
        return [
          `${' '.repeat(indent)}${dumpKey(key)}: ${chalk.yellow('[')}`,
          ...dumpArray(value, indent + 2),
          `${' '.repeat(indent)}${chalk.yellow(']')}`,
        ];
        break;

      default:
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
      return `${' '.repeat(indent)}"${dumpValue(value as string | number)}"`;
    }
  });

export const dumpValue = (value: string | number | unknown): string => {
  switch (typeof value) {
  case 'object':
    return outputColorJson(value);
  case 'string':
    return `${chalk.blue(value)}`;
  case 'number':
    return `${chalk.dim(value)}`;
  default:
    return `${chalk.dim.yellow('Not Set')}`;
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
