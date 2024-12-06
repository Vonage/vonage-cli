process.env.FORCE_COLOR = 0;
const { confirm } = require('../../../src/ux/confirm');
const { displayDate } = require('../../../src/ux/date');
const { handler } = require('../../../src/commands/conversations/update');
const { mockConsole } = require('../../helpers');
const { getTestConversationForAPI, addCLIPropertiesToConversation } = require('../../conversations');

jest.mock('../../../src/ux/confirm');

describe('Command: vonage conversations update', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will update a conversation with no options', async () => {
    const conversation = getTestConversationForAPI();

    const getConversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const updateConversationMock = jest.fn()
      .mockResolvedValue(conversation);

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

    expect(updateConversationMock).toHaveBeenCalledWith({
      id: conversation.id,
      displayName: conversation.displayName,
      name: conversation.name,
      imageUrl: conversation.imageUrl,
      properties: {
        ttl: conversation.properties.ttl,
        customData: conversation.properties.customData,
      },
    });

    expect(console.log).toHaveBeenNthCalledWith(
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

    const getConversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const updateConversationMock = jest.fn()
      .mockResolvedValue(conversation);

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

    expect(updateConversationMock).toHaveBeenCalledWith({
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
    confirm.mockResolvedValue(true);
    const conversation = getTestConversationForAPI();

    const getConversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const updateConversationMock = jest.fn()
      .mockResolvedValue(conversation);

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

    expect(updateConversationMock).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalledWith('Do you want to continue with this mask?');
  });

  test('Will validate event mask and not update', async () => {
    confirm.mockResolvedValue(false);
    const conversation = getTestConversationForAPI();

    const getConversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const updateConversationMock = jest.fn()
      .mockResolvedValue(conversation);

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

    expect(updateConversationMock).not.toHaveBeenCalledWith();
  });
});

