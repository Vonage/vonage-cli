import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { MMSImage } from '@vonage/messages';
import { handler } from '../../../../../src/commands/message/send/mms/image.js';
import { mockConsole } from '../../../../helpers.js';

test('Command: vonage message send mms image', { concurrency: 1 }, async (ctx) => {
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send an MMS image message', async () => {
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
      caption: faker.lorem.sentence(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
      ttl: faker.number.int({ min: 1800, max: 86400 }),
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof MMSImage);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new MMSImage({
        to: argv.to,
        from: argv.from,
        image: {
          url: argv.url,
          caption: argv.caption,
        },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
        ttl: argv.ttl,
      }))),
    );
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
