import chalk from 'chalk';

export type DumpKey = (key: string) => string;

export const dumpKey = (key: string): string => `${chalk.bold(key)}`;

export type DumpValue = (value: Array<unknown> | string | number | unknown) => string;

export const dumpValue = (value: Array<unknown> | string | number | unknown): string => {
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
    return dumpObject(value as Record<string, Array<unknown> | unknown | string>);

  case 'string':
    // falls through
  default:
    return `${chalk.blue(value)}`;
  }
};

export type DumpObject = (
  data: Record<string, Array<unknown> | unknown | string>,
  indent?: number,
) => string;

export const dumpObject = (
  data: Record<string, Array<unknown> | unknown | string>,
  indent = 2,
): string => [
  `${' '.repeat(indent - 2)}${chalk.yellow('{')}`,
  ...Object.entries(data).map(([key, value]) => {
    if (value === undefined || value === null) {
      return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpValue(value)}`;
    }

    const varType = Array.isArray(value) ? 'array' : typeof value;
    switch (varType) {
    case 'object':
      return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpObject(
          value as Record<string, Array<unknown> | unknown | string>,
          indent + 2,
      ).trimStart()}`;

    case 'array':
      return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpArray(
          value as Array<unknown>,
          indent + 2,
      ).trimStart()}`;

    default:
      return `${' '.repeat(indent)}${dumpKey(key)}: ${dumpValue(value)}`;
    }
  }),
  `${' '.repeat(indent - 2)}${chalk.yellow('}')}`,
].join('\n');

export type DumpArray = (data: Array<unknown>, indent?: number) => string;

export const dumpArray = (data: Array<unknown>, indent = 2): string => [
  `${' '.repeat(indent - 2)}${chalk.yellow('[')}`,
  ...data.map((value) => {
    if (value === undefined || value === null) {
      return `${' '.repeat(indent)}${dumpValue(value)}`;
    }

    const varType = Array.isArray(value) ? 'array' : typeof value;
    switch (varType) {
    case 'object':
      return `${' '.repeat(indent)}${dumpObject(
            value as Record<string, Array<unknown> | unknown | string>,
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

export type DumpCommand = (command: string) => string;

export const dumpCommand = (command: string): string => chalk.green(command);
