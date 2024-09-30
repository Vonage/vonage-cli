const app = require('../../src/commands/apps');

describe('Command: vonage app', () => {
  test('should have a command apps', () => {
    expect(app.command).toBe('apps [command]');
    expect(app.handler).toBeInstanceOf(Function);
    const yargs = {};
    yargs.commandDir = jest.fn().mockReturnValue(yargs);
    yargs.options = jest.fn().mockReturnValue(yargs);

    app.builder(yargs);
    expect(yargs.commandDir).toHaveBeenCalledWith('apps');
  });
});
