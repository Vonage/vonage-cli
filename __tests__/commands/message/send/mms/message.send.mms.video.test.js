import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { MMSVideo } from '@vonage/messages';
import { handler } from '../../../../../src/commands/message/send/mms/video.js';
import { mockConsole } from '../../../../helpers.js';

test('Command: vonage message send mms video', { concurrency: 1 }, async (ctx) => {
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send an MMS video message', async () => {
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
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
      ttl: faker.number.int({ min: 1800, max: 86400 }),
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof MMSVideo);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new MMSVideo({
        to: argv.to,
        from: argv.from,
        video: {
          url: argv.url,
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
