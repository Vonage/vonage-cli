process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { messageDataSets } from '../../../../__dataSets__/apps/messageCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities update messages', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/apps/capabilities/update/messages.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will update Message capabilities', async () => runUpdateCapabilityTest({ handler, testCase: messageDataSets[0], exitMock }));
  await ctx.test('Will remov urls and remove methods', async () => runUpdateCapabilityTest({ handler, testCase: messageDataSets[1], exitMock }));
});
