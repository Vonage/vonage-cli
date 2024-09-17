const auth = require('../../src/commands/auth');
const show = require('../../src/commands/auth/show');
const { flags } = require('../../src/commands/auth/show');

describe('Command: vonage auth', () => {
  test('should have a command auth', () => {
    expect(auth.command).toBe('auth [command]');
    expect(auth.handler).toBe(show.handler);
    const yargs = {};
    yargs.options = jest.fn().mockReturnValue(yargs);
    yargs.commandDir = jest.fn().mockReturnValue(yargs);

    auth.builder(yargs);
    expect(yargs.options).toHaveBeenCalledWith(flags);
    expect(yargs.commandDir).toHaveBeenCalledWith('auth');
  });
});
