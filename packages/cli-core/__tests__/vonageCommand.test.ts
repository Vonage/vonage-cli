import { jest, expect } from '@jest/globals';
import { Command, Flags, Args } from '@oclif/core';
import {
  VonageCommand,
  CommandInterface,
  VonageArgs,
  VonageFlags,
} from '../lib/vonageCommand';
import testCases from './__dataSets__/vonageCommand';

const logMock = jest.fn();
Command.prototype.log = logMock;

class TestError extends Error {
  constructor() {
    super('Invalid Application Id');
  }
}

class TestRunCommand implements CommandInterface<typeof TestCommand> {
  static calledFlags: VonageFlags<typeof TestCommand>;
  static calledArgs: VonageArgs<typeof TestCommand>;

  async run(args: VonageArgs<typeof TestCommand>, flags: VonageFlags<typeof TestCommand>): Promise<void> {
    TestRunCommand.calledFlags = flags;
    TestRunCommand.calledArgs = args;
  }
}

class TestCommand extends VonageCommand<typeof TestCommand> {
  static flags = {
    foo: Flags.string()
  };

  static args = {
    fizz: Args.string()

  };

  get runCommand(): CommandInterface<typeof TestCommand> {
    return new TestRunCommand();
  }
}

class TestErrorCommand extends VonageCommand<typeof TestErrorCommand> {
  public static errorToThrow: Error | null = null;

  get runCommand(): CommandInterface<typeof TestErrorCommand> {
    return new TestRunCommand();
  }

  protected errors = {
    [TestError.name]: ['This is a test Error'],
  };

  async run(): Promise<void> {
    throw TestErrorCommand.errorToThrow;
  }
}

describe('Vonnage command', () => {
  afterEach(() => {
    TestErrorCommand.errorToThrow = null;
    jest.resetAllMocks();
  });

  test('Will pass flags to run command', async () => {
    await TestCommand.run(['buzz', '--foo=bar']);

    expect(TestRunCommand.calledFlags).toEqual({
      color: true,
      force: true,
      foo: 'bar',
      'screen-reader': false,
      truncate: 0,
    });
    expect(TestRunCommand.calledArgs).toEqual({
      fizz: 'buzz',
    });
  });

  test.each(testCases)('Will $label', async ({ error, expected }) => {
    TestErrorCommand.errorToThrow = error;
    await TestErrorCommand.run([]);

    expect(logMock.mock.calls).toEqual([
      ...expected,
      [''],
      ['You can set DEBUG=* for more information'],
    ]);
  });

  test('Will include class errors', async () => {
    TestErrorCommand.errorToThrow = new TestError();
    await TestErrorCommand.run([]);

    expect(logMock.mock.calls).toEqual([
      ['This is a test Error'],
      [''],
      ['You can set DEBUG=* for more information'],
    ]);
  });

});
