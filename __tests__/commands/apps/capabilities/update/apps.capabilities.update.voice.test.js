process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { voiceDataSets } from '../../../../__dataSets__/apps/voiceCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities update voice', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/apps/capabilities/update/voice.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will add voice event url', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[0], exitMock }));
  await ctx.test('Will add voice event url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[1], exitMock }));
  await ctx.test('Will replace voice event url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[2], exitMock }));
  await ctx.test('Will add voice answer url', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[3], exitMock }));
  await ctx.test('Will add voice answer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[4], exitMock }));
  await ctx.test('Will replace voice answer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[5], exitMock }));
  await ctx.test('Will add voice fallback url', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[6], exitMock }));
  await ctx.test('Will add voice fallbackAnswer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[7], exitMock }));
  await ctx.test('Will replace voice fallbackAnswer url, method, socket and connection timeout', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[8], exitMock }));
  await ctx.test('Will replace voice settings', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[9], exitMock }));
  await ctx.test('Will remove conversationsTtl, legPersistenceTime, region', async () => runUpdateCapabilityTest({ handler, testCase: voiceDataSets[10], exitMock }));
});
