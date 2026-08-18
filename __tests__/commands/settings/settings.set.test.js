import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../helpers.js';

const saveSettingsFile = mock.fn();
const setSetting = mock.fn();

const __moduleMocks = {
  '../../../src/utils/settings.js': (() => ({
    getSettings: () => ({}),
    saveSettingsFile,
    setSetting,
  }))(),
  '../../../src/middleware/config.js': (() => ({
    getSharedConfig: () => ({
      settingsFile: '/tmp/.vonage/settings.json',
    }),
  }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../src/commands/settings/set.js', __moduleMocks);

suite('Command: vonage settings set', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
    saveSettingsFile.mock.resetCalls();
    setSetting.mock.resetCalls();
  });

  test('Will save a global setting', () => {
    handler({
      key: 'color',
      value: 'on',
    });

    assertCalledWith(setSetting, 'color', true);
    assertCalledWith(saveSettingsFile);
    assertCalledWith(console.log, 'Saved color=on');
  });
});
