import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { MessengerAudio } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { buildMessagesSDK } from '../helpers.js';

test('Command: vonage message send messenger audio', { concurrency: 1 }, async (ctx) => {
  const { handler } = await import('../../../../../src/commands/message/send/messenger/audio.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send a Messenger audio message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.string.numeric(12),
      from: faker.string.numeric(12),
      category: 'update',
      url: faker.internet.url(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof MessengerAudio);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new MessengerAudio({
        to: argv.to,
        from: argv.from,
        messenger: { category: argv.category },
        audio: { url: argv.url },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
      }))),
    );
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
