const { appId, privateKey } = require('../../credentialFlags');
const { loadConversationFromSDK } = require('../../conversations/loadConversationFromSDK');
const { displayConversation } = require('../../conversations/display');

exports.command = 'show <id>';

exports.desc = 'Show conversation';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The conversation ID',
    })
  .options({
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  const { SDK, id } = argv;
  console.info('Showing conversation details');

  const conversation = await loadConversationFromSDK(SDK, id);
  if (!conversation) {
    console.error('No conversation found');
    return;
  }

  console.log('');
  displayConversation(conversation);
};
