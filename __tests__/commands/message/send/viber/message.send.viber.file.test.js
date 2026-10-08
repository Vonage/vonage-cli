import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { ViberFile } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/viber/file.js');

suite('Command: vonage message send viber file', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a Viber file message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      url: faker.internet.url(),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, ViberFile, {
      to: argv.to,
      from: argv.from,
      file: { url: argv.url },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
