process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import { mockConsole } from '../../../../helpers.js';
import { videoDataSets } from '../../../../__dataSets__/apps/videoCapabilities.js';
import { runUpdateCapabilityTest } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/apps/capabilities/update/video.js', __moduleMocks);

suite('Command: vonage apps capabilities update video', () => {
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  suite('archiveStatus webhook', () => {
    test('Will update video archiveStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[0], exitMock }));
    test('Will update video archiveStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[1], exitMock }));
    test('Will replace video archiveStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[2], exitMock }));
    test('Will remove video archiveStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[3], exitMock }));
    test('Will remove video archiveStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[4], exitMock }));
    test('Will remove video archiveStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[5], exitMock }));
  });

  suite('broadcastStatus webhook', () => {
    test('Will update video broadcastStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[6], exitMock }));
    test('Will update video broadcastStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[7], exitMock }));
    test('Will replace video broadcastStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[8], exitMock }));
    test('Will remove video broadcastStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[9], exitMock }));
    test('Will remove video broadcastStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[10], exitMock }));
    test('Will remove video broadcastStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[11], exitMock }));
  });

  suite('captionsStatus webhook', () => {
    test('Will update video captionsStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[12], exitMock }));
    test('Will update video captionsStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[13], exitMock }));
    test('Will replace video captionsStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[14], exitMock }));
    test('Will remove video captionsStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[15], exitMock }));
    test('Will remove video captionsStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[16], exitMock }));
    test('Will remove video captionsStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[17], exitMock }));
  });

  suite('connectionCreated webhook', () => {
    test('Will update video connectionCreated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[18], exitMock }));
    test('Will update video connectionCreated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[19], exitMock }));
    test('Will replace video connectionCreated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[20], exitMock }));
    test('Will remove video connectionCreated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[21], exitMock }));
    test('Will remove video connectionCreated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[22], exitMock }));
    test('Will remove video connectionCreated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[23], exitMock }));
  });

  suite('connectionDestroyed webhook', () => {
    test('Will update video connectionDestroyed URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[24], exitMock }));
    test('Will update video connectionDestroyed URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[25], exitMock }));
    test('Will replace video connectionDestroyed', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[26], exitMock }));
    test('Will remove video connectionDestroyed URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[27], exitMock }));
    test('Will remove video connectionDestroyed URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[28], exitMock }));
    test('Will remove video connectionDestroyed secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[29], exitMock }));
  });

  suite('renderStatus webhook', () => {
    test('Will update video renderStatus URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[30], exitMock }));
    test('Will update video renderStatus URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[31], exitMock }));
    test('Will replace video renderStatus', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[32], exitMock }));
    test('Will remove video renderStatus URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[33], exitMock }));
    test('Will remove video renderStatus URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[34], exitMock }));
    test('Will remove video renderStatus secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[35], exitMock }));
  });

  suite('sipCallCreated webhook', () => {
    test('Will update video sipCallCreated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[36], exitMock }));
    test('Will update video sipCallCreated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[37], exitMock }));
    test('Will replace video sipCallCreated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[38], exitMock }));
    test('Will remove video sipCallCreated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[39], exitMock }));
    test('Will remove video sipCallCreated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[40], exitMock }));
    test('Will remove video sipCallCreated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[41], exitMock }));
  });

  suite('sipCallDestroyed webhook', () => {
    test('Will update video sipCallDestroyed URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[42], exitMock }));
    test('Will update video sipCallDestroyed URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[43], exitMock }));
    test('Will replace video sipCallDestroyed', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[44], exitMock }));
    test('Will remove video sipCallDestroyed URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[45], exitMock }));
    test('Will remove video sipCallDestroyed URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[46], exitMock }));
    test('Will remove video sipCallDestroyed secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[47], exitMock }));
  });

  suite('sipCallMuteForced webhook', () => {
    test('Will update video sipCallMuteForced URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[48], exitMock }));
    test('Will update video sipCallMuteForced URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[49], exitMock }));
    test('Will replace video sipCallMuteForced', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[50], exitMock }));
    test('Will remove video sipCallMuteForced URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[51], exitMock }));
    test('Will remove video sipCallMuteForced URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[52], exitMock }));
    test('Will remove video sipCallMuteForced secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[53], exitMock }));
  });

  suite('sipCallUpdated webhook', () => {
    test('Will update video sipCallUpdated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[54], exitMock }));
    test('Will update video sipCallUpdated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[55], exitMock }));
    test('Will replace video sipCallUpdated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[56], exitMock }));
    test('Will remove video sipCallUpdated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[57], exitMock }));
    test('Will remove video sipCallUpdated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[58], exitMock }));
    test('Will remove video sipCallUpdated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[59], exitMock }));
  });

  suite('streamCreated webhook', () => {
    test('Will update video streamCreated URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[60], exitMock }));
    test('Will update video streamCreated URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[61], exitMock }));
    test('Will replace video streamCreated', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[62], exitMock }));
    test('Will remove video streamCreated URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[63], exitMock }));
    test('Will remove video streamCreated URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[64], exitMock }));
    test('Will remove video streamCreated secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[65], exitMock }));
  });

  suite('streamDestroyed webhook', () => {
    test('Will update video streamDestroyed URL (without secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[66], exitMock }));
    test('Will update video streamDestroyed URL (with secret)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[67], exitMock }));
    test('Will replace video streamDestroyed', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[68], exitMock }));
    test('Will remove video streamDestroyed URL (without secret and other webhooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[69], exitMock }));
    test('Will remove video streamDestroyed URL (without secret and other hooks)', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[70], exitMock }));
    test('Will remove video streamDestroyed secret', async () => runUpdateCapabilityTest({ handler, testCase: videoDataSets[71], exitMock }));
  });
});
