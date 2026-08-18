import { suite, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { WhatsAppTemplate } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';
import { assertSentMessage, buildMessagesSDK } from '../helpers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../../src/commands/message/send/whatsapp/template.js', __moduleMocks);

suite('Command: vonage message send whatsapp template', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will send a WhatsApp template message', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      policy: 'deterministic',
      locale: 'en',
      name: faker.lorem.slug(),
      parameters: [faker.word.words(1), faker.word.words(1)],
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assertSentMessage(sendMock, WhatsAppTemplate, {
      to: argv.to,
      from: argv.from,
      whatsapp: { policy: argv.policy, locale: argv.locale },
      template: { name: argv.name, parameters: argv.parameters },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    });

    assertCalledWith(console.log, messageUUID);
  });

  test('Will error when parameters are not an array', async () => {
    const messageUUID = faker.string.uuid();
    const { sendMock, sdkMock } = buildMessagesSDK(messageUUID);
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.phone.number('+1##########'),
      policy: 'deterministic',
      locale: 'en',
      name: faker.lorem.slug(),
      parameters: { [faker.word.words(1)]: faker.word.words(1) },
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);
    assert.equal(0, sendMock.mock.calls.length);
  });
});
