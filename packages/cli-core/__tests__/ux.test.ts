import { expect } from '@jest/globals';
import chalk from 'chalk';
import { dumpValue, truncateString } from '../lib/ux';
import uxTests from './__dataSets__/ux';

describe('UX tests', () => {
  test.each(uxTests)('Will $label', ({ value, expected }) => {
    expect(dumpValue(value)).toEqual(expected);
  });

  test('Will not truncate string', () => {
    expect(truncateString('a'.repeat(25))).toEqual(chalk.blue('a'.repeat(25)));
  });

  test('Will truncate long string', () => {
    expect(truncateString('a'.repeat(27), 26)).toEqual(
      chalk.blue('a'.repeat(26)) + chalk.dim(' ...value truncated'),
    );
  });
});
