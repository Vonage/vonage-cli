const { appId, privateKey } = require('../../credentialFlags');
const { loadConversationFromSDK } = require('../../conversations/loadConversationFromSDK');
const { displayConversation } = require('../../conversations/display');
const { conversationIdFlag } = require('../../conversations/conversationFlags');

exports.command = 'show <conversation-id>';

exports.desc = 'Show conversation';

exports.builder = (yargs) => yargs
  .positional(
    'conversation-id',
    conversationIdFlag,
  )
  .options({
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  const { SDK, conversationId } = argv;
  console.info('Showing conversation details');

  const conversation = await loadConversationFromSDK(SDK, conversationId);
  if (!conversation) {
    console.error('No conversation found');
    return;
  }

  console.log('');
  displayConversation(conversation);
};
