import { suite, test } from 'node:test';
import { mockConsole } from '../../helpers.js';

const __moduleMocks = {
  '../../../src/utils/settings.js': (() => ({
    getSettings: () => ({
      color: true,
      emoji: false,
      redact: true,
    }),
  }))(),
  '../../../src/middleware/config.js': (() => ({
    getSharedConfig: () => ({
      settingsFile: '/tmp/.vonage/settings.json',
    }),
  }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../src/commands/settings/show.js', __moduleMocks);

suite('Command: vonage settings show', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will show global settings', () => {
    handler();

    assertNthCalledWith(console.log, 1, 'Global settings file: /tmp/.vonage/settings.json');
    assertNthCalledWith(
      console.log,
      3,
      [
        'Color Output: Off',
        'Emoji Output: On',
        'Redaction: Off',
      ].join('\n'),
    );
  });
});
