process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { messageDataSets } from '../../../../__dataSets__/apps/messageCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/apps/capabilities/update/messages.js', __moduleMocks);

suite('Command: vonage apps capabilities update messages', () => {
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  test('Will update Message capabilities', async () => runUpdateCapabilityTest({ handler, testCase: messageDataSets[0], exitMock }));
  test('Will remov urls and remove methods', async () => runUpdateCapabilityTest({ handler, testCase: messageDataSets[1], exitMock }));
});
