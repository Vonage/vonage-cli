import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { ViberVideo } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/viber/video.js');

suite('Command: vonage message send viber video', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a Viber video message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      url: faker.internet.url(),
      caption: faker.lorem.sentence(),
      thumbUrl: faker.internet.url(),
      duration: String(faker.number.int({ min: 5, max: 120 })),
      fileSize: String(faker.number.int({ min: 1, max: 20 })),
      ttl: faker.number.int({ min: 60, max: 3600 }),
      viberType: 'video',
      category: 'transaction',
      actionUrl: faker.internet.url(),
      actionText: faker.lorem.words(2),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, ViberVideo, {
      to: argv.to,
      from: argv.from,
      video: { url: argv.url, caption: argv.caption, thumbUrl: argv.thumbUrl },
      viberService: {
        ttl: argv.ttl,
        type: argv.viberType,
        category: argv.category,
        action: { url: argv.actionUrl, text: argv.actionText },
        duration: argv.duration,
        fileSize: argv.fileSize,
      },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
