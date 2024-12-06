const { confirm } = require('../../ux/confirm');
const { appId, privateKey } = require('../../credentialFlags');
const { force } = require('../../commonFlags');
const { makeSDKCall } = require('../../utils/makeSDKCall');

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

  const conversation = await makeSDKCall(
    SDK.conversations.getConversation.bind(SDK.conversations),
    'Fetching conversation',
    id,
  );
  console.debug('Conversation to delete', conversation);

  if (!await confirm('Are you sure you want to delete this conversation?')) {
    console.log('Conversation not deleted');
    return;
  }


  await makeSDKCall(
    SDK.conversations.deleteConversation.bind(SDK.conversations),
    'Deleting conversation',
    conversation.id,
  );

  console.log('');
  console.log('Conversation deleted');
};
