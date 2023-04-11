import { diff } from 'jest-diff';
import { expect } from '@jest/globals';
import { printReceived, printExpected, matcherHint } from 'jest-matcher-utils';
import type { MatcherFunction } from 'expect';

// disable chalk colors
process.env.FORCE_COLOR = '0';

// Set these here to ensure calls to API will fail
process.env.VONAGE_API_KEY = 'env-key';
process.env.VONAGE_API_SECRET = 'env-secret';
process.env.VONAGE_PRIVATE_KEY = 'env-private-key';
process.env.VONAGE_APPLICATION_ID = 'env-app-id';
process.env.XDG_CONFIG_HOME = __dirname;

let stdout: Array<string>;

beforeEach(() => {
  stdout = [];
  jest.spyOn(process.stdout, 'write').mockImplementation(
    (val: unknown): boolean =>
    // Record each line of stdout to allow checking lines
      !!stdout.push(`${val}`.trim()),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

const matchStdout = (text: string): Array<string> =>
  stdout.join('\n').match(new RegExp(`${text}`, 'gm'));

const getStdOutLine = (lineNumber: number): string => {
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
      )} exceeds length of lines outputted ${printExpected(
        stdout.length,
      )}`,
    );
  }

  return stdout[lineNumber - 1];
};

const matchesOutput: MatcherFunction<[actual: string]> = (actual: string) => {
  if (typeof actual !== 'string') {
    throw new Error('Actual must be a string');
  }

  const pass = matchStdout(actual);
  return {
    message: (): string =>
      `expected string ${printExpected(
        actual,
      )} was not output: ${printReceived(stdout.join('\n'))}`,
    pass: !!pass,
  };
};

const isOnLine: MatcherFunction<[expected: unknown, line: number]> = (
  expected: string,
  lineNumber: number,
) => {
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
        matcherHint('isOnLine')
                + '\n\n'
                + (diffString && diffString.includes('- Expect')
                  ? `Difference:\n\n${diffString}`
                  : `Expected: ${printExpected(
                    expected,
                  )}\nReceived: ${printReceived(line)}`),
      pass: !!pass,
    };
  } catch (error) {
    return {
      message: (): string => error.message,
      pass: false,
    };
  }
};

const matchesOutputOnLine: MatcherFunction<[actual: unknown, line: number]> = (
  actual: string,
  lineNumber: number,
) => {
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
        `expected string ${printExpected(
          actual,
        )} was not output on line ${lineNumber}:\n ${printReceived(
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
};

expect.extend({
  matchesOutput,
  matchesOutputOnLine,
  isOnLine,
});

declare module 'expect' {
    interface Matchers<R> {
        matchesOutput(): R
        matchesOutputOnLine(line: number): R
        isOnLine(line: number): R
    }
}
