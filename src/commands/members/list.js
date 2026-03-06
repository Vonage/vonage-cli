import { conversationIdFlag } from '../../conversations/conversationFlags.js';
import { appId, privateKey } from '../../credentialFlags.js';
import { confirm } from '../../ux/confirm.js';
import { memberSummary } from '../../members/display.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';

export const command = 'list <conversation-id>';

export const desc = 'List members';

/* istanbul ignore next */
export const builder = (yargs) => yargs
  .positional(
    'conversation-id',
    conversationIdFlag,
  )
  .options({
    'page-size': {
      describe: 'Number of members to return per page',
      default: 100,
    },
    'cursor': {
      describe: 'Cursor for the next page',
    },
    'order': {
      describe: 'Return the members in ascending or descending order.',
      choices: ['asc', 'desc'],
    },
    'app-id': appId,
    'private-key': privateKey,
  });

export const handler = async (argv) => {
  console.info('List members');
  const { SDK, pageSize, cursor, conversationId } = argv;

  let pageCursor = cursor;
  let okToPage = false;

  do {
    console.debug(`Fetching members for conversation ${conversationId} with cursor: ${pageCursor}`);
    const response = await makeSDKCall(
      SDK.conversations.getMemberPage.bind(SDK.conversations),
      !okToPage
        ? 'Fetching members'
        : 'Fetching more members',
      conversationId,
      {
        pageSize: pageSize,
        cursor: pageCursor,
      },
    );

    console.debug('Members fetched', response);
    console.debug('Members', response);
    const membersToDisplay = response.members.map(memberSummary);

    if (membersToDisplay.length === 0) {
      console.log('No members found for this conversation.');
      return;
    }

    console.table(membersToDisplay);

    pageCursor = response.links?.next?.href
      ? new URL(response.links.next.href).searchParams.get('cursor')
      : null;

    console.debug(`Next cursor: ${pageCursor}`);

    if (pageCursor !== null) {
      okToPage = await confirm('There are more members. Do you want to continue?');
    }
  } while (okToPage && pageCursor !== null);
};
