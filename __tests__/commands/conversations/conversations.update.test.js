import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { displayDate } from '../../../src/ux/locale.js';

import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI, addCLIPropertiesToConversation } from '../../conversations.js';

test('Command: vonage conversations update', { concurrency: 1 }, async (ctx) => {
  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));

  const confirm = mock.fn();

  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });

  const { handler } = await import('../../../src/commands/conversations/update.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will update a conversation with no options', async () => {
    const conversation = getTestConversationForAPI();

    const getConversationMock = mock.fn(() => Promise.resolve(conversation));

    const updateConversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        updateConversation: updateConversationMock,
        getConversation: getConversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: conversation.id,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateConversationMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      id: conversation.id,
      displayName: conversation.displayName,
      name: conversation.name,
      imageUrl: conversation.imageUrl,
      properties: {
        ttl: conversation.properties.ttl,
        customData: conversation.properties.customData,
      },
    }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `Name: ${conversation.name}`,
      `Conversation ID: ${conversation.id}`,
      `Display Name: ${conversation.displayName}`,
      `Image URL: ${conversation.imageUrl}`,
      `State: ${conversation.state}`,
      `Time to Leave: ${conversation.properties.ttl}`,
      `Created at: ${displayDate(conversation.timestamp.created)}`,
      `Updated at: ${displayDate(conversation.timestamp.updated)}`,
      'Destroyed at: Not Set',
      `Sequence: ${conversation.sequenceNumber}`,
    ].join('\n'), ]);
  });

  await ctx.test('Will update a conversation', async () => {
    const conversation = getTestConversationForAPI();
    const cliConversation = addCLIPropertiesToConversation(conversation);

    const getConversationMock = mock.fn(() => Promise.resolve(conversation));

    const updateConversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        updateConversation: updateConversationMock,
        getConversation: getConversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: conversation.id,
      name: cliConversation.name,
      displayName: cliConversation.displayName,
      imageUrl: cliConversation.imageUrl,
      ttl: cliConversation.properties.ttl,
      customData: cliConversation.properties.customData,
      callbackUrl: cliConversation.callback.url,
      callbackMethod: cliConversation.callback.method,
      callbackEventMask: cliConversation.callback.eventMask,
      callbackApplicationId: cliConversation.callback.params.applicationId,
      callbackNccoUrl: cliConversation.callback.params.nccoUrl,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateConversationMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      id: conversation.id,
      displayName: cliConversation.displayName,
      imageUrl: cliConversation.imageUrl,
      name: cliConversation.name,
      properties: {
        ttl: cliConversation.properties.ttl,
        customData: cliConversation.properties.customData,
      },
      callback: {
        eventMask: cliConversation.callback.eventMask.join(','),
        method: cliConversation.callback.method,
        params: {
          applicationId: cliConversation.callback.params.applicationId,
          nccoUrl: cliConversation.callback.params.nccoUrl,
        },
        url: cliConversation.callback.url,
      },
    }])));
  });

  await ctx.test('Will validate event mask and update', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));
    const conversation = getTestConversationForAPI();

    const getConversationMock = mock.fn(() => Promise.resolve(conversation));

    const updateConversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        updateConversation: updateConversationMock,
        getConversation: getConversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: ['foo:bar'],
    });

    assert.ok(updateConversationMock.mock.callCount() > 0);
    assert.deepStrictEqual(confirm.mock.calls[0].arguments, ['Do you want to continue with this mask?']);
  });

  await ctx.test('Will validate event mask and not update', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(false));
    const conversation = getTestConversationForAPI();

    const getConversationMock = mock.fn(() => Promise.resolve(conversation));

    const updateConversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        updateConversation: updateConversationMock,
        getConversation: getConversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: ['foo:bar'],
    });

    assert.strictEqual(updateConversationMock.mock.callCount(), 0);
  });
});
