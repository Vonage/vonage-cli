process.env.FORCE_COLOR = 0;
const { confirm } = require('../../../src/ux/confirm');
const { EventType } = require('@vonage/conversations');
const { displayDate } = require('../../../src/ux/date');
const yargs = require('yargs');
const { handler } = require('../../../src/commands/conversations/create');
const { mockConsole } = require('../../helpers');
const { getTestConversationForAPI, addCLIPropertiesToConversation } = require('../../conversations');

const conversationEvents = Object.values(EventType);

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage conversations create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will create a conversation with no options', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock });

    expect(conversationMock).toHaveBeenCalledWith({
      displayName: undefined,
      imageUrl: undefined,
      name: undefined,
      numbers: undefined,
      properties: {
        customData: undefined,
        ttl: undefined,
      },
      callback: {
        eventMask: undefined,
        method: undefined,
        params: {
          applicationId: undefined,
          nccoUrl: undefined,
        },
        url: undefined,
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

  test('Will create a conversation', async () => {
    const conversation = getTestConversationForAPI();
    const cliConversation = addCLIPropertiesToConversation(conversation);

    const conversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: cliConversation.name,
      displayName: cliConversation.displayName,
      imageUrl: cliConversation.imageUrl,
      ttl: cliConversation.properties.ttl,
      customData: cliConversation.properties.customData,
      phoneNumber: cliConversation.numbers[0].number,
      callbackUrl: cliConversation.callback.url,
      callbackMethod: cliConversation.callback.method,
      callbackEventMask: cliConversation.callback.eventMask,
      callbackApplicationId: cliConversation.callback.params.applicationId,
      callbackNccoUrl: cliConversation.callback.params.nccoUrl,
    });

    expect(conversationMock).toHaveBeenCalledWith({
      displayName: cliConversation.displayName,
      imageUrl: cliConversation.imageUrl,
      name: cliConversation.name,
      numbers: [
        {
          type: 'phone',
          number: cliConversation.numbers[0].number,
        },
      ],
      properties: {
        ttl: cliConversation.properties.ttl,
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

  test('Will validate event mask and create', async () => {
    confirm.mockResolvedValue(true);
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: ['foo:bar'],
    });

    expect(conversationMock).toHaveBeenCalledWith({
      displayName: undefined,
      imageUrl: undefined,
      name: undefined,
      numbers: undefined,
      properties: {
        customData: undefined,
        ttl: undefined,
      },
      callback: {
        eventMask: 'foo:bar',
        method: undefined,
        params: {
          applicationId: undefined,
          nccoUrl: undefined,
        },
        url: undefined,
      },
    });
    expect(console.warn).toHaveBeenCalledWith('Invalid event mask: foo:bar');
    expect(confirm).toHaveBeenCalledWith('Do you want to continue with this mask?');
  });

  test('Will validate multiple event masks and create', async () => {
    confirm.mockResolvedValue(true);
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: [
        ...conversationEvents,
        'aduio:play',
      ],
    });

    expect(console.warn).toHaveBeenNthCalledWith(
      1,
      'Invalid event mask: aduio:play',
    );

    expect(console.warn).toHaveBeenNthCalledWith(
      2,
      'Did you mean: audio:play, audio:say, audio:dtmf?',
    );

    expect(confirm).toHaveBeenCalledWith('Do you want to continue with these masks?');

    expect(conversationMock).toHaveBeenCalledWith({
      displayName: undefined,
      imageUrl: undefined,
      name: undefined,
      numbers: undefined,
      properties: {
        customData: undefined,
        ttl: undefined,
      },
      callback: {
        eventMask: [
          ...conversationEvents,
          'aduio:play',
        ].join(','),
        method: undefined,
        params: {
          applicationId: undefined,
          nccoUrl: undefined,
        },
        url: undefined,
      },
    });
  });

  test('Will validate multiple event masks and not create', async () => {
    confirm.mockResolvedValue(false);
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValue(conversation);

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: [
        ...conversationEvents,
        'aduio:play',
      ],
    });

    expect(conversationMock).not.toHaveBeenCalled();
  });

  test('Will handle SDK error', async () => {

    const conversationMock = jest.fn()
      .mockRejectedValue(new Error('SDK Error'));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock });

    expect(conversationMock).toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
