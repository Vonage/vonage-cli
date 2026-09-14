process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { networkDataSets } from '../../../../__dataSets__/apps/networkCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities update network_apis', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/apps/capabilities/update/networkApis.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will update network redirect url and network app id', async () => runUpdateCapabilityTest({ handler, testCase: networkDataSets[0], exitMock }));
  await ctx.test('Will replace network redirect url', async () => runUpdateCapabilityTest({ handler, testCase: networkDataSets[1], exitMock }));
});
