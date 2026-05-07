
describe('UX: confirm', () => {
  const inputFromTTY = jest.fn();

  test('Will confrim the message with y', async () => {
    inputFromTTY.mockResolvedValue('y');
    const { confirm } = await loadModule(
      import.meta.url,
      '../../src/ux/confirm.js',
      { '../../src/ux/input.js': { inputFromTTY } },
    );

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(inputFromTTY).toHaveBeenCalledWith({ message: 'Are you sure?', length: 1 });
    expect(inputFromTTY).toHaveBeenCalledTimes(1);
  });

  test('Will confrim the message with n', async () => {
    inputFromTTY.mockReset();
    inputFromTTY.mockResolvedValue('n');

    const { confirm } = await loadModule(
      import.meta.url,
      '../../src/ux/confirm.js',
      { '../../src/ux/input.js': { inputFromTTY } },
    );
    const result = await confirm('Are you sure?');
    expect(result).toBe(false);
  });

  test('Will keep asking with invalid input message', async () => {
    inputFromTTY.mockReset();
    inputFromTTY.mockResolvedValueOnce('x').mockResolvedValue('y');

    const { confirm } = await loadModule(
      import.meta.url,
      '../../src/ux/confirm.js',
      { '../../src/ux/input.js': { inputFromTTY } },
    );
    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(inputFromTTY).toHaveBeenCalledTimes(2);
  });
});
