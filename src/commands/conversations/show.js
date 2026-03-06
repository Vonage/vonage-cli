import { appId, privateKey } from '../../credentialFlags.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { displayConversation } from '../../conversations/display.js';
import { conversationIdFlag } from '../../conversations/conversationFlags.js';

export const command = 'show <conversation-id>';

export const desc = 'Show conversation';

export const builder = (yargs) => yargs
  .positional(
    'conversation-id',
    conversationIdFlag,
  )
  .options({
    'app-id': appId,
    'private-key': privateKey,
  });

export const handler = async (argv) => {
  const { SDK, conversationId } = argv;
  console.info('Showing conversation details');

  const conversation = await makeSDKCall(
    SDK.conversations.getConversation.bind(SDK.conversations),
    'Fetching conversation',
    conversationId,
  );

  if (!conversation) {
    console.error('No conversation found');
    return;
  }

  console.log('');
  displayConversation(conversation);
};
