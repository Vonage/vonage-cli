import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { displayDate } from '../../../src/ux/locale.js';

const yargs = {
  exit: jest.fn(),
};

const confirm = jest.fn();

jest.unstable_mockModule('yargs', () => ({
  default: yargs,
}));

jest.unstable_mockModule('../../../src/ux/confirm.js', () => ({
  confirm,
}));

const { handler } = await import('../../../src/commands/conversations/show.js');
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
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
