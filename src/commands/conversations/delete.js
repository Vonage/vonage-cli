import { confirm } from '../../ux/confirm.js';
import { appId, privateKey } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';

export const command = 'delete <id>';

export const desc = 'Delete conversation';

export const builder = (yargs) => yargs
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

export const handler = async (argv) => {
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
