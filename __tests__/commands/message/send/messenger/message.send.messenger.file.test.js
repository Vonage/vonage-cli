import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { MessengerFile } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/messenger/file.js');

suite('Command: vonage message send messenger file', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a Messenger file message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.string.numeric(12),
      from: faker.string.numeric(12),
      category: 'response',
      url: faker.internet.url(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, MessengerFile, {
      to: argv.to,
      from: argv.from,
      messenger: { category: argv.category },
      file: { url: argv.url },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
