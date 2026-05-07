process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { voiceDataSets } from '../../../../__dataSets__/apps/voiceCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/apps/capabilities/update/voice.js', __moduleMocks);

suite('Command: vonage apps capabilities update voice', () => {
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  test('Will add voice event url', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[0], exitMock }));
  test('Will add voice event url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[1], exitMock }));
  test('Will replace voice event url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[2], exitMock }));
  test('Will add voice answer url', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[3], exitMock }));
  test('Will add voice answer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[4], exitMock }));
  test('Will replace voice answer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[5], exitMock }));
  test('Will add voice fallback url', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[6], exitMock }));
  test('Will add voice fallbackAnswer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[7], exitMock }));
  test('Will replace voice fallbackAnswer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[8], exitMock }));
  test('Will replace voice settings', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[9], exitMock }));
  test('Will remove conversationsTtl, legPersistenceTime, region', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[10], exitMock }));
});
