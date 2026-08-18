import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { MessengerImage } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { buildMessagesSDK } from '../helpers.js';

test('Command: vonage message send messenger image', { concurrency: 1 }, async (ctx) => {
  const { handler } = await import('../../../../../src/commands/message/send/messenger/image.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send a Messenger image message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.string.numeric(12),
      from: faker.string.numeric(12),
      category: 'response',
      url: faker.internet.url(),
      caption: faker.lorem.sentence(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof MessengerImage);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new MessengerImage({
        to: argv.to,
        from: argv.from,
        messenger: { category: argv.category },
        image: { url: argv.url, caption: argv.caption },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
      }))),
    );
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
