import { displayDate } from '../../../src/ux/locale.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const confirm = mock.fn();



const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/conversations/update.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI, addCLIPropertiesToConversation } from '../../conversations.js';

describe('Command: vonage conversations update', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  test('Will update a conversation with no options', async () => {
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

    assertCalledWith(updateConversationMock, {
      id: conversation.id,
      displayName: conversation.displayName,
      name: conversation.name,
      imageUrl: conversation.imageUrl,
      properties: {
        ttl: conversation.properties.ttl,
        customData: conversation.properties.customData,
      },
    });

    assertNthCalledWith(
      console.log,
      2,
      [
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
      ].join('\n'),
    );
  });

  test('Will update a conversation', async () => {
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

    assertCalledWith(updateConversationMock, {
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
    });
  });

  test('Will validate event mask and update', async () => {
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
    assertCalledWith(confirm, 'Do you want to continue with this mask?');
  });

  test('Will validate event mask and not update', async () => {
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

    assertNotCalledWith(updateConversationMock);
  });
});
