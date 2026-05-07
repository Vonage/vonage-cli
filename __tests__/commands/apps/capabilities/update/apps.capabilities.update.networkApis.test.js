process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { networkDataSets } from '../../../../__dataSets__/apps/networkCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/apps/capabilities/update/networkApis.js', __moduleMocks);

suite('Command: vonage apps capabilities update network_apis', () => {
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  test('Will update network redirect url and network app id', async () => runUpdateCapabilityTest({ handler, testCase: networkDataSets[0], exitMock }));
  test('Will replace network redirect url', async () => runUpdateCapabilityTest({ handler, testCase: networkDataSets[1], exitMock }));
});
