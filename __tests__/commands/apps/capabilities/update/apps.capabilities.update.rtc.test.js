process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { rtcDataSets } from '../../../../__dataSets__/apps/rtcCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/apps/capabilities/update/rtc.js', __moduleMocks);

suite('Command: vonage apps capabilities update rtc', () => {
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  test('Will update RTC event URL', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[0], exitMock }));
  test('Will update RTC event URL and method', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[1], exitMock }));
  test('Will replace RTC event URL method', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[2], exitMock }));
  test('Will modify RTC signed signedCallbacks', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[3], exitMock }));
  test('Will remove rtc url when passing in empty string (__remove__ from coerce function)', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[4], exitMock }));
});
