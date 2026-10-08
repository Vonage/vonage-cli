import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { WhatsAppCustom } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/whatsapp/custom.js');

suite('Command: vonage message send whatsapp custom', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a WhatsApp custom message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const custom = {
      type: 'template',
      template: {
        namespace: faker.lorem.slug(),
        name: faker.lorem.slug(),
      },
    };
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      custom,
      contextMessageUuid: faker.string.uuid(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, WhatsAppCustom, {
      to: argv.to,
      from: argv.from,
      custom,
      context: { messageUUID: argv.contextMessageUuid },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
