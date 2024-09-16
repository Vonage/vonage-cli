const auth = require('../../src/commands/auth');
const show = require('../../src/commands/auth/show');

describe('Command: vonage auth', () => {
  test('should have a command auth', () => {
    expect(auth.command).toBe('auth [command]');
    expect(auth.handler).toBe(show.handler);
  });
});
