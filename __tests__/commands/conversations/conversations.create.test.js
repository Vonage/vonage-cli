import { EventType } from '@vonage/conversations';
import { displayDate } from '../../../src/ux/locale.js';

const confirm = mock.fn();

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));



const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
  'yargs': (() => ({
    default: yargs,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/conversations/create.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI, addCLIPropertiesToConversation } from '../../conversations.js';

const conversationEvents = Object.values(EventType);

describe('Command: vonage conversations create', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    confirm.mock.resetCalls();
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  test('Will create a conversation with no options', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock });

    assertCalledWith(conversationMock, {
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

  test('Will create a conversation', async () => {
    const conversation = getTestConversationForAPI();
    const cliConversation = addCLIPropertiesToConversation(conversation);

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

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

    assertCalledWith(conversationMock, {
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

  test('Will validate event mask and create', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: ['foo:bar'],
    });

    assertCalledWith(conversationMock, {
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
    assertCalledWith(console.warn, 'Invalid event mask: foo:bar');
    assertCalledWith(confirm, 'Do you want to continue with this mask?');
  });

  test('Will validate multiple event masks and create', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

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

    assertNthCalledWith(
      console.warn,
      1,
      'Invalid event mask: aduio:play',
    );

    assertNthCalledWith(
      console.warn,
      2,
      'Did you mean: audio:play?',
    );

    assertCalledWith(confirm, 'Do you want to continue with these masks?');

    assertCalledWith(conversationMock, {
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
    confirm.mock.mockImplementation(() => Promise.resolve(false));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 0);
  });
});
