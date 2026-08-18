import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { ViberImage } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { buildMessagesSDK } from '../helpers.js';

test('Command: vonage message send viber image', { concurrency: 1 }, async (ctx) => {
  const { handler } = await import('../../../../../src/commands/message/send/viber/image.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send a Viber image message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      url: faker.internet.url(),
      caption: faker.lorem.sentence(),
      ttl: faker.number.int({ min: 60, max: 3600 }),
      viberType: 'picture',
      category: 'promotion',
      actionUrl: faker.internet.url(),
      actionText: faker.lorem.words(2),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof ViberImage);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new ViberImage({
        to: argv.to,
        from: argv.from,
        image: { url: argv.url, caption: argv.caption },
        viberService: {
          ttl: argv.ttl,
          type: argv.viberType,
          category: argv.category,
          action: { url: argv.actionUrl, text: argv.actionText },
        },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
      }))),
    );
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
