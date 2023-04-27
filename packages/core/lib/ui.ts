import chalk from 'chalk';

export const truncate = (value: string, length = 25): string =>
  `${value}`.length > length
    ? value.substring(0, length) + chalk.dim(' ...truncated')
    : value;
