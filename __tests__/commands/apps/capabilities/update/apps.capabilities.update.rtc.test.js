process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { rtcDataSets } from '../../../../__dataSets__/apps/rtcCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities update rtc', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/apps/capabilities/update/rtc.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will update RTC event URL', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[0], exitMock }));
  await ctx.test('Will update RTC event URL and method', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[1], exitMock }));
  await ctx.test('Will replace RTC event URL method', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[2], exitMock }));
  await ctx.test('Will modify RTC signed signedCallbacks', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[3], exitMock }));
  await ctx.test('Will remove rtc url when passing in empty string (__remove__ from coerce function)', async () => runUpdateCapabilityTest({ handler, testCase: rtcDataSets[4], exitMock }));
});
