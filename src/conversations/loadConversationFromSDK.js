const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

const loadConversationFromSDK = async (SDK, conversationId) => {
  const { stop, fail } = spinner({
    message: 'Fetching conversation',
  });

  try {
    const conversation = await SDK.conversations.getConversation(conversationId);
    stop();
    console.debug('Conversation from API', conversation);
    return conversation;
  } catch (error) {
    fail();
    sdkError(error);
  }
};

exports.loadConversationFromSDK = loadConversationFromSDK;
