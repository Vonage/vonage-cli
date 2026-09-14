process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { verifyDataSets } from '../../../../__dataSets__/apps/verifyCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities update verify', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/apps/capabilities/update/verify.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will update Verify capabilities', async () => runUpdateCapabilityTest({ handler, testCase: verifyDataSets[0], exitMock }));
  await ctx.test('Will replace Verify capabilities', async () => runUpdateCapabilityTest({ handler, testCase: verifyDataSets[1], exitMock }));
  await ctx.test('Will remove verify when removing status url', async () => runUpdateCapabilityTest({ handler, testCase: verifyDataSets[2], exitMock }));
});
