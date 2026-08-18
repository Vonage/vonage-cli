import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { WhatsAppCustom } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';

test('Command: vonage message send whatsapp custom', { concurrency: 1 }, async (ctx) => {
  const { handler } = await import('../../../../../src/commands/message/send/whatsapp/custom.js');
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send a WhatsApp custom message', async () => {
    const messageUUID = faker.string.uuid();
    const sendMock = mock.fn(() => Promise.resolve({ messageUUID }));
    const sdkMock = {
      messages: {
        send: sendMock,
      },
    };
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

    assert.strictEqual(sendMock.mock.callCount(), 1);

    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof WhatsAppCustom);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new WhatsAppCustom({
        to: argv.to,
        from: argv.from,
        custom,
        context: { messageUUID: argv.contextMessageUuid },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
      }))),
    );
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
