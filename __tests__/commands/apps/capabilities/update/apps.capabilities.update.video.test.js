process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { videoDataSets } from '../../../../__dataSets__/apps/videoCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities update video', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/apps/capabilities/update/video.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will update video archiveStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[0], exitMock }));
  await ctx.test('Will update video archiveStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[1], exitMock }));
  await ctx.test('Will replace video archiveStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[2], exitMock }));
  await ctx.test('Will remove video archiveStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[3], exitMock }));
  await ctx.test('Will remove video archiveStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[4], exitMock }));
  await ctx.test('Will remove video archiveStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[5], exitMock }));

  await ctx.test('Will update video broadcastStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[6], exitMock }));
  await ctx.test('Will update video broadcastStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[7], exitMock }));
  await ctx.test('Will replace video broadcastStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[8], exitMock }));
  await ctx.test('Will remove video broadcastStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[9], exitMock }));
  await ctx.test('Will remove video broadcastStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[10], exitMock }));
  await ctx.test('Will remove video broadcastStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[11], exitMock }));

  await ctx.test('Will update video captionsStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[12], exitMock }));
  await ctx.test('Will update video captionsStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[13], exitMock }));
  await ctx.test('Will replace video captionsStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[14], exitMock }));
  await ctx.test('Will remove video captionsStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[15], exitMock }));
  await ctx.test('Will remove video captionsStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[16], exitMock }));
  await ctx.test('Will remove video captionsStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[17], exitMock }));

  await ctx.test('Will update video connectionCreated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[18], exitMock }));
  await ctx.test('Will update video connectionCreated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[19], exitMock }));
  await ctx.test('Will replace video connectionCreated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[20], exitMock }));
  await ctx.test('Will remove video connectionCreated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[21], exitMock }));
  await ctx.test('Will remove video connectionCreated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[22], exitMock }));
  await ctx.test('Will remove video connectionCreated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[23], exitMock }));

  await ctx.test('Will update video connectionDestroyed URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[24], exitMock }));
  await ctx.test('Will update video connectionDestroyed URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[25], exitMock }));
  await ctx.test('Will replace video connectionDestroyed', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[26], exitMock }));
  await ctx.test('Will remove video connectionDestroyed URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[27], exitMock }));
  await ctx.test('Will remove video connectionDestroyed URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[28], exitMock }));
  await ctx.test('Will remove video connectionDestroyed secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[29], exitMock }));

  await ctx.test('Will update video renderStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[30], exitMock }));
  await ctx.test('Will update video renderStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[31], exitMock }));
  await ctx.test('Will replace video renderStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[32], exitMock }));
  await ctx.test('Will remove video renderStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[33], exitMock }));
  await ctx.test('Will remove video renderStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[34], exitMock }));
  await ctx.test('Will remove video renderStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[35], exitMock }));

  await ctx.test('Will update video sipCallCreated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[36], exitMock }));
  await ctx.test('Will update video sipCallCreated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[37], exitMock }));
  await ctx.test('Will replace video sipCallCreated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[38], exitMock }));
  await ctx.test('Will remove video sipCallCreated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[39], exitMock }));
  await ctx.test('Will remove video sipCallCreated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[40], exitMock }));
  await ctx.test('Will remove video sipCallCreated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[41], exitMock }));

  await ctx.test('Will update video sipCallDestroyed URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[42], exitMock }));
  await ctx.test('Will update video sipCallDestroyed URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[43], exitMock }));
  await ctx.test('Will replace video sipCallDestroyed', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[44], exitMock }));
  await ctx.test('Will remove video sipCallDestroyed URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[45], exitMock }));
  await ctx.test('Will remove video sipCallDestroyed URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[46], exitMock }));
  await ctx.test('Will remove video sipCallDestroyed secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[47], exitMock }));

  await ctx.test('Will update video sipCallMuteForced URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[48], exitMock }));
  await ctx.test('Will update video sipCallMuteForced URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[49], exitMock }));
  await ctx.test('Will replace video sipCallMuteForced', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[50], exitMock }));
  await ctx.test('Will remove video sipCallMuteForced URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[51], exitMock }));
  await ctx.test('Will remove video sipCallMuteForced URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[52], exitMock }));
  await ctx.test('Will remove video sipCallMuteForced secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[53], exitMock }));

  await ctx.test('Will update video sipCallUpdated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[54], exitMock }));
  await ctx.test('Will update video sipCallUpdated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[55], exitMock }));
  await ctx.test('Will replace video sipCallUpdated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[56], exitMock }));
  await ctx.test('Will remove video sipCallUpdated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[57], exitMock }));
  await ctx.test('Will remove video sipCallUpdated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[58], exitMock }));
  await ctx.test('Will remove video sipCallUpdated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[59], exitMock }));

  await ctx.test('Will update video streamCreated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[60], exitMock }));
  await ctx.test('Will update video streamCreated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[61], exitMock }));
  await ctx.test('Will replace video streamCreated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[62], exitMock }));
  await ctx.test('Will remove video streamCreated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[63], exitMock }));
  await ctx.test('Will remove video streamCreated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[64], exitMock }));
  await ctx.test('Will remove video streamCreated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[65], exitMock }));

  await ctx.test('Will update video streamDestroyed URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[66], exitMock }));
  await ctx.test('Will update video streamDestroyed URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[67], exitMock }));
  await ctx.test('Will replace video streamDestroyed', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[68], exitMock }));
  await ctx.test('Will remove video streamDestroyed URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[69], exitMock }));
  await ctx.test('Will remove video streamDestroyed URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[70], exitMock }));
  await ctx.test('Will remove video streamDestroyed secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[71], exitMock }));
});
