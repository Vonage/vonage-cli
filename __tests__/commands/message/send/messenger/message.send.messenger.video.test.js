import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { MessengerVideo } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/messenger/video.js');

suite('Command: vonage message send messenger video', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a Messenger video message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.string.numeric(12),
      from: faker.string.numeric(12),
      category: 'message_tag',
      tag: 'POST_PURCHASE_UPDATE',
      url: faker.internet.url(),
      caption: faker.lorem.sentence(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, MessengerVideo, {
      to: argv.to,
      from: argv.from,
      messenger: { category: argv.category, tag: argv.tag },
      video: { url: argv.url, caption: argv.caption },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
