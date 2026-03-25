import { jest } from '@jest/globals';

describe('UX: confirm', () => {
  jest.unstable_mockModule('../../src/ux/input', () => ({ inputFromTTY: jest.fn() }));

  test('Will confrim the message with y', async () => {
    const { inputFromTTY } = await import('../../src/ux/input.js');

    inputFromTTY.mockResolvedValue('y');
    const { confirm } = await import('../../src/ux/confirm.js');

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(inputFromTTY).toHaveBeenCalledWith({ message: 'Are you sure?', length: 1 });
    expect(inputFromTTY).toHaveBeenCalledTimes(1);
  });

  test('Will confrim the message with n', async () => {
    const { inputFromTTY } = await import('../../src/ux/input.js');
    inputFromTTY.mockResolvedValue('n');

    const { confirm } = await import('../../src/ux/confirm.js');
    const result = await confirm('Are you sure?');
    expect(result).toBe(false);
  });

  test('Will keep asking with invalid input message', async () => {
    const { inputFromTTY } = await import('../../src/ux/input.js');
    inputFromTTY.mockResolvedValue('x').mockResolvedValue('y');

    const { confirm } = await import('../../src/ux/confirm.js');
    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
  });
});
