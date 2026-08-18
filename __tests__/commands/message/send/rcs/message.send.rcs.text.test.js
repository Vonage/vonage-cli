import { suite, test } from 'node:test';
import { faker } from '@faker-js/faker';
import { RCSText } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/rcs/text.js');

suite('Command: vonage message send rcs text', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send an RCS text message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const suggestions = [{ type: 'reply', title: 'Yes', postbackData: 'yes' }];
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      text: faker.lorem.sentence(),
      suggestions,
      ttl: faker.number.int({ min: 60, max: 3600 }),
      rcsCategory: 'transaction',
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, RCSText, {
      to: argv.to,
      from: argv.from,
      text: argv.text,
      suggestions,
      ttl: argv.ttl,
      rcs: { category: argv.rcsCategory },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });

  test('Will send an RCS text message without category', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const suggestions = [{ type: 'reply', title: 'Yes', postbackData: 'yes' }];
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      text: faker.lorem.sentence(),
      suggestions,
      ttl: faker.number.int({ min: 60, max: 3600 }),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, RCSText, {
      to: argv.to,
      from: argv.from,
      text: argv.text,
      suggestions,
      ttl: argv.ttl,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });
    assertCalledWith(console.log, messageUUID);
  });
});
