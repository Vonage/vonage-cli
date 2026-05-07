import { displayDate } from '../../../src/ux/locale.js';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

const confirm = jest.fn();

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
    jest.resetAllMocks();
  });

  test('Will show a conversation', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, conversationId: conversation.id });

    expect(conversationMock).toHaveBeenCalledWith(conversation.id);

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

  test('Will handle an error', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockRejectedValueOnce(new Error('An error occurred'));

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });
    expect(console.log).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(99);
  });
});
