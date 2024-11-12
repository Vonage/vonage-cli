const { spinner } = require('../../ux/spinner');
const { confirm } = require('../../ux/confirm');
const { sdkError } = require('../../utils/sdkError');
const { appId, privateKey } = require('../../credentialFlags');
const { force } = require('../../commonFlags');
const { loadConversationFromSDK } = require('../../conversations/loadConversationFromSDK');

exports.command = 'delete <id>';

exports.desc = 'Delete conversation';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The conversation ID',
    })
  .options({
    'force': force,
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  const { SDK, id } = argv;
  console.info('Deleting conversation');

  const conversation = await loadConversationFromSDK(SDK, id);
  console.debug('Conversation to delete', conversation);

  if (!await confirm('Are you sure you want to delete this conversation?')) {
    console.log('Conversation not deleted');
    return;
  }

  const { stop, fail } = spinner({message: 'Deleting conversation'});

  try {
    await SDK.conversations.deleteConversation(conversation.id);
    stop();
  } catch (error) {
    fail(error.message);
    sdkError(error);
    return;
  }

  console.log('');
  console.log('Conversation deleted');
};
