import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { RCSFile } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/rcs/file.js');

suite('Command: vonage message send rcs file', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send an RCS file message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      url: faker.internet.url(),
      ttl: faker.number.int({ min: 60, max: 3600 }),
      rcsCategory: 'transaction',
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, RCSFile, {
      to: argv.to,
      from: argv.from,
      file: { url: argv.url },
      ttl: argv.ttl,
      rcs: { category: argv.rcsCategory },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });

  test('Will send an RCS file message without category', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      url: faker.internet.url(),
      ttl: faker.number.int({ min: 60, max: 3600 }),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, RCSFile, {
      to: argv.to,
      from: argv.from,
      file: { url: argv.url },
      ttl: argv.ttl,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
