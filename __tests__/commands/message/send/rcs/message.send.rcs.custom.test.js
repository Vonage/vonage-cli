import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { RCSCustom } from '@vonage/messages';
import { mockConsole } from '../../../../helpers.js';


test('Command: vonage message send rcs custom', { concurrency: 1 }, async (ctx) => {
  const { handler } = await import('../../../../../src/commands/message/send/rcs/custom.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will send an RCS custom message', async () => {
    const messageUUID = faker.string.uuid();
    const sendMock = mock.fn(() => Promise.resolve({ messageUUID }));
    const sdkMock = { messages: { send: sendMock } };
    const custom = { cards: [{ title: faker.lorem.words(2) }] };
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      custom,
      ttl: faker.number.int({ min: 60, max: 3600 }),
      rcsCategory: 'promotion',
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof RCSCustom);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(message)), JSON.parse(JSON.stringify(new RCSCustom({
      to: argv.to,
      from: argv.from,
      custom,
      ttl: argv.ttl,
      rcs: { category: argv.rcsCategory },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    }))));
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });

  await ctx.test('Will send an RCS custom message without category', async () => {
    const messageUUID = faker.string.uuid();
    const sendMock = mock.fn(() => Promise.resolve({ messageUUID }));
    const sdkMock = { messages: { send: sendMock } };
    const custom = { cards: [{ title: faker.lorem.words(2) }] };
    const argv = {
      SDK: sdkMock,
      to: faker.phone.number('+1##########'),
      from: faker.company.name(),
      custom,
      ttl: faker.number.int({ min: 60, max: 3600 }),
      clientRef: faker.string.alphanumeric(10),
      webhookUrl: faker.internet.url(),
      webhookVersion: 'v1',
    };

    await handler(argv);

    assert.strictEqual(sendMock.mock.callCount(), 1);
    const [message] = sendMock.mock.calls[0].arguments;
    assert.ok(message instanceof RCSCustom);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(message)), JSON.parse(JSON.stringify(new RCSCustom({
      to: argv.to,
      from: argv.from,
      custom,
      ttl: argv.ttl,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
    }))));
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [messageUUID]);
  });
});
