const jwt = require('../../src/commands/jwt');

describe('Command: vonage jwt', () => {
  test('should have a command jwt', () => {
    expect(jwt.command).toBe('jwt <command>');
    expect(jwt.handler()).toBeUndefined();
  });
});
