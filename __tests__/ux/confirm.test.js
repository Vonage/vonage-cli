describe('UX: confirm', () => {
  const inputFromTTY = mock.fn();

  test('Will confrim the message with y', async () => {
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('y'));
    const { confirm } = await loadModule(
      import.meta.url,
      '../../src/ux/confirm.js',
      { '../../src/ux/input.js': { inputFromTTY } },
    );

    const result = await confirm('Are you sure?');
    assert.strictEqual(result, true);
    assertCalledWith(inputFromTTY, { message: 'Are you sure?', length: 1 });
    assert.strictEqual(inputFromTTY.mock.callCount(), 1);
  });

  test('Will confrim the message with n', async () => {
    inputFromTTY.mock.resetCalls();
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('n'));

    const { confirm } = await loadModule(
      import.meta.url,
      '../../src/ux/confirm.js',
      { '../../src/ux/input.js': { inputFromTTY } },
    );
    const result = await confirm('Are you sure?');
    assert.strictEqual(result, false);
  });

  test('Will keep asking with invalid input message', async () => {
    inputFromTTY.mock.resetCalls();
    inputFromTTY.mock.mockImplementationOnce(() => Promise.resolve('x'));
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('y'));

    const { confirm } = await loadModule(
      import.meta.url,
      '../../src/ux/confirm.js',
      { '../../src/ux/input.js': { inputFromTTY } },
    );
    const result = await confirm('Are you sure?');
    assert.strictEqual(result, true);
    assert.strictEqual(inputFromTTY.mock.callCount(), 2);
  });
});
