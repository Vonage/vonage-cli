import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { SMS } from '@vonage/messages';
import { faker } from '@faker-js/faker';
import { mockConsole } from '../../../helpers.js';

const { handler } = await loadModule(
  import.meta.url,
  '../../../../src/commands/message/send/sms.js',
);

suite('Command: vonage message send sms', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send an SMS message', async () => {
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
      text: faker.lorem.sentence(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
      ttl: faker.number.int({ min: 1800, max: 86400 }),
      trustedRecipient: true,
      encodingType: 'unicode',
      contentId: faker.string.alphanumeric(12),
      entityId: faker.string.alphanumeric(12),
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);

    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof SMS);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new SMS({
        to: argv.to,
        from: argv.from,
        text: argv.text,
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
        ttl: argv.ttl,
        trustedRecipient: argv.trustedRecipient,
        sms: {
          encodingType: argv.encodingType,
          contentId: argv.contentId,
          entityId: argv.entityId,
        },
      }))),
    );

    assertCalledWith(console.log, messageUUID);
  });

  test('Will send an SMS message without optional SMS settings', async () => {
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
      text: faker.lorem.sentence(),
    };

    await handler(argv);

    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof SMS);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new SMS({
        to: argv.to,
        from: argv.from,
        text: argv.text,
      }))),
    );

    assertCalledWith(console.log, messageUUID);
  });
});
