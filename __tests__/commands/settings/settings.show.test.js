import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';

test('Command: vonage settings show', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('../../../src/utils/settings.js', {
    namedExports: {
      getSettings: () => ({
        color: true,
        emoji: false,
        redact: true,
      }),
    },
  });
  ctx.mock.module('../../../src/middleware/config.js', {
    namedExports: {
      getSharedConfig: () => ({
        settingsFile: '/tmp/.vonage/settings.json',
      }),
    },
  });

  const { handler } = await import('../../../src/commands/settings/show.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will show global settings', () => {
    handler();

    assert.deepStrictEqual(
      console.log.mock.calls[0].arguments,
      ['Global settings file: /tmp/.vonage/settings.json'],
    );
    assert.deepStrictEqual(
      console.log.mock.calls[2].arguments,
      [[
        'Color Output: Off',
        'Emoji Output: On',
        'Redaction: Off',
      ].join('\n')],
    );
  });
});
