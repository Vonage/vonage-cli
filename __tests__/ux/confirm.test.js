import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

test('UX: confirm', async (ctx) => {
  const inputFromTTY = mock.fn();
  const parserDetailed = mock.fn(() => ({ argv: {} }));
  const oldStderrWrite = process.stderr.write;

  ctx.mock.module('../../src/ux/input.js', { namedExports: { inputFromTTY } });
  ctx.mock.module('yargs-parser', { defaultExport: { detailed: parserDetailed } });

  ctx.beforeEach(() => {
    inputFromTTY.mock.resetCalls();
    parserDetailed.mock.resetCalls();
    parserDetailed.mock.mockImplementation(() => ({ argv: {} }));
    process.stderr.write = mock.fn();
  });

  ctx.afterEach(() => {
    process.stderr.write = oldStderrWrite;
  });

  await ctx.test('Will confrim the message with y', async () => {
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('y'));
    const { confirm } = await import('../../src/ux/confirm.js?yes');

    const result = await confirm('Are you sure?');
    assert.strictEqual(result, true);
    assert.deepStrictEqual(inputFromTTY.mock.calls[0].arguments, [{ message: 'Are you sure?', length: 1 }]);
    assert.strictEqual(inputFromTTY.mock.calls.length, 1);
  });

  await ctx.test('Will confrim the message with n', async () => {
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('n'));
    const { confirm } = await import('../../src/ux/confirm.js?no');
    const result = await confirm('Are you sure?');
    assert.strictEqual(result, false);
  });

  await ctx.test('Will keep asking with invalid input message', async () => {
    inputFromTTY.mock.mockImplementationOnce(() => Promise.resolve('x'));
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('y'));
    const { confirm } = await import('../../src/ux/confirm.js?retry');
    const result = await confirm('Are you sure?');
    assert.strictEqual(result, true);
    assert.strictEqual(inputFromTTY.mock.calls.length, 2);
  });

  await ctx.test('Will auto confirm when force is enabled', async () => {
    parserDetailed.mock.mockImplementation(() => ({ argv: { force: true } }));
    const { confirm } = await import('../../src/ux/confirm.js?force');

    const result = await confirm('Are you sure?');
    assert.strictEqual(result, true);
    assert.strictEqual(inputFromTTY.mock.calls.length, 0);
  });

  await ctx.test('Will use the default response when the answer is empty', async () => {
    inputFromTTY.mock.mockImplementation(() => Promise.resolve(''));
    const { confirm } = await import('../../src/ux/confirm.js?default');

    const result = await confirm('Are you sure?', { defaultResponse: false });
    assert.strictEqual(result, false);
    assert.strictEqual(process.stderr.write.mock.calls.length, 0);
  });

  await ctx.test('Will support custom truthy and allowed responses', async () => {
    inputFromTTY.mock.mockImplementation(() => Promise.resolve('O'));
    const { confirm } = await import('../../src/ux/confirm.js?custom');

    const result = await confirm('Overwrite?', {
      allowedResponses: ['o', 'x'],
      truthyResponse: 'o',
    });

    assert.strictEqual(result, true);
    assert.deepStrictEqual(process.stderr.write.mock.calls[0].arguments, ['\n']);
  });

  await ctx.test('Will print the custom invalid message before retrying', async () => {
    let callCount = 0;
    inputFromTTY.mock.mockImplementation(() => Promise.resolve(callCount++ === 0 ? 'maybe' : 'n'));
    const { confirm } = await import('../../src/ux/confirm.js?invalid');

    const result = await confirm('Are you sure?', { invalidMessage: 'Use y or n' });
    assert.strictEqual(result, false);
    assert.deepStrictEqual(process.stderr.write.mock.calls[0].arguments, ['\nUse y or n\n']);
  });
});
