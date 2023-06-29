import { jest, expect } from '@jest/globals';
import { Command } from '@oclif/core';
import { VonageCommand } from '../lib/vonageCommand';
import testCases from './__dataSets__/vonageCommand';

const logMock = jest.fn();
Command.prototype.log = logMock;

class TestError extends Error {
  constructor() {
    super('Invalid Application Id');
  }
}

class TestClass extends VonageCommand<typeof TestClass> {
  public static errorToThrow: Error | null = null;

  protected errors = {
    [TestError.name]: ['This is a test Error'],
  };

  async run(): Promise<void> {
    throw TestClass.errorToThrow;
  }
}

describe('Vonnage command', () => {
  afterEach(() => {
    TestClass.errorToThrow = null;
    jest.resetAllMocks();
  });

  test.each(testCases)('Will $label', async ({ error, expected }) => {
    TestClass.errorToThrow = error;
    await TestClass.run([]);

    expect(logMock.mock.calls).toEqual([
      ...expected,
      [''],
      ['You can set DEBUG=* for more information'],
    ]);
  });

  test('Will include class errors', async () => {
    TestClass.errorToThrow = new TestError();
    await TestClass.run([]);

    expect(logMock.mock.calls).toEqual([
      ['This is a test Error'],
      [''],
      ['You can set DEBUG=* for more information'],
    ]);
  });
});
