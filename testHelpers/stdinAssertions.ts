import { diff } from 'jest-diff';
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
  const testInput = (question: string, expectedType: 'confirm' | 'prompt') => {
    const inputIndex = inputs.findIndex(
      ({ message, called, type }) =>
        !called && type == expectedType && message === question,
    );

    if (inputIndex < 0) {
      errored = true;
      const expected = inputs.find(({ called }) => !called);
      const diffString = diff(question, expected?.message, { expand: true });

      throw new Error(
        `No response defined for input [${expectedType}] "${question}".\n\n${diffString}`,
      );
    }

    inputs[inputIndex].called = true;
    const { order, response, type, message } = inputs[inputIndex];

    if (order !== inputCount) {
      errored = true;
      throw new Error(`The input [${type}] "${message}" was asked out of order`);
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
  const notCalled = inputs.filter(({ called }) => !called);
  if (!errored && notCalled.length > 0) {
    throw new Error(
      `There are still (${notCalled.length}) open inputs waiting\n `
        + notCalled.map(({ message }) => message).join('\n'),
    );
  }
  inputs = [];
});

expect.extend({
  respondsWith(expected: string, response: string) {
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
  },
  willConfirm(expected: string) {
    inputs.push({
      type: 'confirm',
      order: inputs.length,
      message: `${expected}`.trim() + ' [y/n]',
      // eslint-disable-next-line no-invalid-this
      response: !this.isNot,
      called: false,
    });

    // satisfies assertion
    return {
      message: (): string => 'Responded',
      // eslint-disable-next-line no-invalid-this
      pass: !this.isNot,
    };
  },
});

declare module 'expect' {
  interface Matchers<R> {
    respondsWith(response: string): R
    willConfirm(): R
  }
}
