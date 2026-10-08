import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { WhatsAppVideo } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/whatsapp/video.js');

suite('Command: vonage message send whatsapp video', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a WhatsApp video message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      url: faker.internet.url(),
      caption: faker.lorem.sentence(),
      contextMessageUuid: faker.string.uuid(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, WhatsAppVideo, {
      to: argv.to,
      from: argv.from,
      video: { url: argv.url, caption: argv.caption },
      context: { messageUUID: argv.contextMessageUuid },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
