import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { MMSContent } from '@vonage/messages';
import { assertSentMessage, buildMessagesSDK, mockConsole } from '../../../../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/mms/content.js');

suite('Command: vonage message send mms content', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send an MMS content message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const content = [{ type: 'image', url: faker.internet.url(), content: faker.lorem.sentence() }];
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      content,
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
      ttl: faker.number.int({ min: 60, max: 3600 }),
    };

    await handler(argv);

    assertSentMessage(sendMock, MMSContent, {
      to: argv.to,
      from: argv.from,
      content,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
      ttl: argv.ttl,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
