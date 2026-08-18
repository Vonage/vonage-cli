import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { MMSVideo } from '@vonage/messages';
import { assertSentMessage, buildMessagesSDK, mockConsole } from '../../../../helpers.js';

const { handler } = await loadModule(
  import.meta.url,
  '../../../../../src/commands/message/send/mms/video.js',
);

suite('Command: vonage message send mms video', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send an MMS video message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
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

    assertSentMessage(sendMock, MMSVideo, {
      to: argv.to,
      from: argv.from,
      video: {
        url: argv.url,
      },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
      ttl: argv.ttl,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
