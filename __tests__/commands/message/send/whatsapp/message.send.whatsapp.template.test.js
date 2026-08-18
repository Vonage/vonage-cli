import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { WhatsAppTemplate } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';


const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

test('Command: vonage message send whatsapp template', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../../src/commands/message/send/whatsapp/template.js');
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send a WhatsApp template message', async () => {
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
      policy: 'deterministic',
      locale: 'en',
      name: faker.lorem.slug(),
      parameters: [faker.word.words(1), faker.word.words(1)],
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);

    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof WhatsAppTemplate);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(message)),
      JSON.parse(JSON.stringify(new WhatsAppTemplate({
        to: argv.to,
        from: argv.from,
        whatsapp: { policy: argv.policy, locale: argv.locale },
        template: { name: argv.name, parameters: argv.parameters },
        clientRef: argv.clientRef,
        webhookUrl: argv.webhookUrl,
        webhookVersion: argv.webhookVersion,
      }))),
    );

    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });

  await ctx.test('Will error when parameters are not an array', async () => {
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
      policy: 'deterministic',
      locale: 'en',
      name: faker.lorem.slug(),
      parameters: { [faker.word.words(1)]: faker.word.words(1) },
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);
    assert.strictEqual(sendMock.mock.callCount(), 0);
  });
});
