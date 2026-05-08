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




const { handler } = await loadModule(import.meta.url, '../../../src/commands/conversations/show.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

describe('Command: vonage conversations show', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  test('Will show a conversation', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, conversationId: conversation.id });

    assertCalledWith(conversationMock, conversation.id);

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

  test('Will handle an error', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.reject(new Error('An error occurred')));

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });
    assert.strictEqual(console.log.mock.callCount(), 0);
    assertCalledWith(exitMock, 99);
  });
});
