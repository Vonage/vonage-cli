import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';

const saveSettingsFile = mock.fn();
const setSetting = mock.fn();

test('Command: vonage settings set', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('../../../src/utils/settings.js', {
    namedExports: {
      getSettings: () => ({}),
      saveSettingsFile,
      setSetting,
    },
  });
  ctx.mock.module('../../../src/middleware/config.js', {
    namedExports: {
      getSharedConfig: () => ({
        settingsFile: '/tmp/.vonage/settings.json',
      }),
    },
  });

  const { handler } = await import('../../../src/commands/settings/set.js');

  ctx.beforeEach(() => {
    mockConsole();
    saveSettingsFile.mock.resetCalls();
    setSetting.mock.resetCalls();
  });

  await ctx.test('Will save a global setting', () => {
    handler({
      key: 'color',
      value: 'on',
    });

    assert.deepStrictEqual(setSetting.mock.calls[0].arguments, ['color', true]);
    assert.strictEqual(saveSettingsFile.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, ['Saved color=on']);
  });
});
