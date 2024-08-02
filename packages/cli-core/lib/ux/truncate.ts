import chalk from 'chalk';
import { dumpValue } from './dump';

export type TruncateString = (
  length: number,
  value: string,
) => string;

export type TruncateStringCurry = (value: string) => string;

export const truncateString = (
  length: number,
  value: string,
): string =>
  length > 0 && `${value}`.length > length
    ? dumpValue(value.substring(0, length)) + chalk.dim(' ...value truncated')
    : dumpValue(value);


