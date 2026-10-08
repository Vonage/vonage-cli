import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { WhatsAppReaction } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/whatsapp/reaction.js');

suite('Command: vonage message send whatsapp reaction', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a WhatsApp reaction message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      action: 'react',
      emoji: '😍',
      contextMessageUuid: faker.string.uuid(),
      category: 'marketing',
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, WhatsAppReaction, {
      to: argv.to,
      from: argv.from,
      reaction: { action: argv.action, emoji: argv.emoji },
      context: { messageUUID: argv.contextMessageUuid },
      category: argv.category,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
