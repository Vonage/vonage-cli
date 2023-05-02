import type { MatcherFunction } from 'expect';
import debug from 'debug';

const log = debug('testhelpers:stdin');

export type InputExpectation = {
    order: number
    message: string
    response: string | number | boolean
    type: 'confirm' | 'prompt'
    called: boolean
}

let inputs: Array<InputExpectation> = [];
let inputCount = 0;
let errored = false;

jest.mock('@oclif/core', () => {
  const testInput = (
    question: string,
    expectedType: 'confirm' | 'prompt',
  ) => {
    const inputIndex = inputs.findIndex(
      ({ message, called, type }) =>
        !called && type == expectedType && message === question,
    );

    if (inputIndex < 0) {
      log(inputs);
      errored = true;
      throw new Error(
        `No response defined for [${expectedType}] "${question}"`,
      );
    }

    inputs[inputIndex].called = true;
    const { order, response, type, message } = inputs[inputIndex];

    if (order !== inputCount) {
      errored = true;
      throw new Error(`The [${type}] "${message}" was asked out of order`);
    }

    inputCount++;
    return response;
  };

  return {
    ...jest.requireActual('@oclif/core'),
    ux: {
      confirm: (question: string) => {
        return testInput(question, 'confirm');
      },
      prompt: (question: string) => {
        return testInput(question, 'prompt');
      },
    },
  };
});

beforeEach(() => {
  errored = false;
});

afterEach(() => {
  jest.restoreAllMocks();
  inputCount = 0;
  const notCalled = !!inputs.find(({ called }) => !called);
  if (!errored && notCalled) {
    throw new Error('There are still open inputs');
  }
  inputs = [];
});

const willConfirm: MatcherFunction<[expected: unknown]> = (
  expected: string,
) => {
  inputs.push({
    type: 'confirm',
    order: inputs.length,
    message: `${expected}`.trim() + ' [y/n]',
    response: true,
    called: false,
  });

  // satisfies assertion
  return {
    message: (): string => 'Responded',
    pass: true,
  };
};

const respondsWith: MatcherFunction<[expected: unknown, response: string]> = (
  expected: string,
  response: string,
) => {
  inputs.push({
    type: 'prompt',
    order: inputs.length,
    message: expected,
    response: response,
    called: false,
  });

  // satisfies assertion
  return {
    message: (): string => 'Responded',
    pass: true,
  };
};

expect.extend({
  respondsWith,
  willConfirm,
});

declare module 'expect' {
    interface Matchers<R> {
        respondsWith(response: string): R
        willConfirm(): R
    }
}
