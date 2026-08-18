import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { MMSVcard } from '@vonage/messages';
import { assertSentMessage, buildMessagesSDK, mockConsole } from '../../../../helpers.js';

const { handler } = await loadModule(
  import.meta.url,
  '../../../../../src/commands/message/send/mms/vcard.js',
);

suite('Command: vonage message send mms vcard', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send an MMS vCard message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
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

    assertSentMessage(sendMock, MMSVcard, {
      to: argv.to,
      from: argv.from,
      vcard: {
        url: argv.url,
        caption: argv.caption,
      },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
      ttl: argv.ttl,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
