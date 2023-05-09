import { diff } from 'jest-diff';
import { expect } from '@jest/globals';
import { printReceived, printExpected, matcherHint } from 'jest-matcher-utils';
import stripAnsi from 'strip-ansi';

export const keyFile = `${__dirname}/private.test.key`;

// Set these here to ensure calls to API will fail
process.env.VONAGE_API_KEY = 'env-key';
process.env.VONAGE_API_SECRET = 'env-secret';
process.env.VONAGE_PRIVATE_KEY = 'env-private-key';
process.env.VONAGE_APPLICATION_ID = 'env-app-id';

// Make sure we do not load am actual config file
process.env.XDG_CONFIG_HOME = `${process.cwd()}/test`;

let stdout: Array<string>;

beforeEach(() => {
  stdout = [];
  jest.mock('@oclif/core', () => {
    return {
      ...jest.requireActual('@oclif/core'),
    };
  });

  jest.spyOn(process.stdout, 'write').mockImplementation(
    (val: string): boolean =>
      // Record each line of stdout to allow checking lines
      !!stdout.push(`${stripAnsi(val)}`.trim()),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
  process.env.VONAGE_API_KEY = 'env-key';
  process.env.VONAGE_API_SECRET = 'env-secret';
  process.env.VONAGE_PRIVATE_KEY = 'env-private-key';
  process.env.VONAGE_APPLICATION_ID = 'env-app-id';
});

export const getStdOutLine = (lineNumber: number): string => {
  if (lineNumber < 1) {
    throw new Error(
      `Line number ${printReceived(
        lineNumber,
      )} must be greater than or equal to 1.`,
    );
  }

  if (lineNumber > stdout.length) {
    throw new Error(
      `Line number ${printReceived(
        lineNumber,
      )} exceeds length of lines outputted ${printExpected(stdout.length)}`,
    );
  }

  return stdout[lineNumber - 1];
};

expect.extend({
  matchesOutput(actual: string) {
    if (typeof actual !== 'string') {
      throw new Error('Actual must be a string');
    }

    const pass = stdout.join('\n').match(new RegExp(`${actual}`, 'gm'));
    return {
      message: (): string =>
        `expected string ${printExpected(
          actual,
        )} was not output: ${printReceived(stdout.join('\n'))}`,
      pass: !!pass,
    };
  },

  wasOutputOnLine(expected: string, lineNumber: number) {
    if (typeof lineNumber !== 'number') {
      throw new Error('Line must be a number');
    }

    if (typeof expected !== 'string') {
      throw new Error('Actual must be a string');
    }

    try {
      const line = getStdOutLine(lineNumber);
      const pass = line === expected;
      const diffString = diff(line, expected, { expand: true });

      return {
        message: (): string =>
          matcherHint('wasOutputOnLine')
          + '\n\n'
          + (diffString && diffString.includes('- Expect')
            ? `Difference:\n\n${diffString}`
            : `Expected: ${printExpected(expected)}\nReceived: ${printReceived(
              line,
            )}`),
        pass: !!pass,
      };
    } catch (error) {
      return {
        message: (): string => error.message,
        pass: false,
      };
    }
  },

  matchesOutputOnLine(actual: string, lineNumber: number) {
    if (typeof lineNumber !== 'number') {
      throw new Error('Line must be a number');
    }

    if (typeof actual !== 'string') {
      throw new Error('Actual must be a string');
    }

    try {
      const line = getStdOutLine(lineNumber);
      const pass = `${line}`.match(new RegExp(actual, 'g'));
      return {
        message: (): string =>
          `expected string:\n${printExpected(
            actual,
          )}\n\nWas not matched on line ${lineNumber}:\n ${printReceived(
            line,
          )}`,
        pass: !!pass,
      };
    } catch (error) {
      return {
        message: (): string => error.message,
        pass: false,
      };
    }
  },

  wasOutput(actual: Array<string>) {
    if (!Array.isArray(actual)) {
      throw new Error('Actual must be an array of strings');
    }

    const pass = stdout.join('\n') === actual.join('\n');
    const diffString = diff(actual, stdout, { expand: true });

    return {
      message: (): string =>
        matcherHint('wasOutput')
        + '\n\n'
        + (diffString && diffString.includes('- Expect')
          ? `Difference:\n\n${diffString}`
          : `Expected: ${printExpected(actual)}\nReceived: ${printReceived(
            actual,
          )}`),
      pass: !!pass,
    };
  },
});

declare module 'expect' {
  interface Matchers<R> {
    matchesOutput(): R
    matchesOutputOnLine(line: number): R
    wasOutputOnLine(line: number): R
    wasOutput(): R
  }
}
