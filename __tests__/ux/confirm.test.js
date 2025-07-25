const { confirm } = require('../../src/ux/confirm');
const { inputFromTTY } = require('../../src/ux/input');

jest.mock('../../src/ux/input');

describe('UX: confirm', () => {
  test('Will confrim the message with y', async () => {
    inputFromTTY.mockResolvedValue('y');

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(inputFromTTY).toHaveBeenCalledWith({message: 'Are you sure?', length: 1});
    expect(inputFromTTY).toHaveBeenCalledTimes(1);
  });

  test('Will confrim the message with n', async () => {
    inputFromTTY.mockResolvedValue('n');

    const result = await confirm('Are you sure?');
    expect(result).toBe(false);
  });

  test('Will keep asking with invalid input message', async () => {
    inputFromTTY.mockResolvedValue('x').mockResolvedValue('y');

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
  });
});
