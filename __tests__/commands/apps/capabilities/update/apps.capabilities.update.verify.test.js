process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { verifyDataSets } from '../../../../__dataSets__/apps/verifyCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/apps/capabilities/update/verify.js', __moduleMocks);

suite('Command: vonage apps capabilities update verify', () => {
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  test('Will update Verify capabilities', async () => runUpdateCapabilityTest({ handler, testCase: verifyDataSets[0], exitMock }));
  test('Will replace Verify capabilities', async () => runUpdateCapabilityTest({ handler, testCase: verifyDataSets[1], exitMock }));
  test('Will remove verify when removing status url', async () => runUpdateCapabilityTest({ handler, testCase: verifyDataSets[2], exitMock }));
});
