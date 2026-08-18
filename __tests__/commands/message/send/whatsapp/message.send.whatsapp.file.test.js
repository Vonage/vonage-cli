import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { WhatsAppFile } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';

test('Command: vonage message send whatsapp file', { concurrency: 1 }, async (ctx) => {
  const { handler } = await import('../../../../../src/commands/message/send/whatsapp/file.js');
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send a WhatsApp file message', async () => {
    const messageUUID = faker.string.uuid();
    const sendMock = mock.fn(() => Promise.resolve({ messageUUID }));
    const sdkMock = {
      messages: {
        send: sendMock,
      },
    };
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      url: faker.internet.url(),
      contextMessageUuid: faker.string.uuid(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);

    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof WhatsAppFile);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new WhatsAppFile({
        to: argv.to,
        from: argv.from,
        file: { url: argv.url },
        context: { messageUUID: argv.contextMessageUuid },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
      }))),
    );
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
