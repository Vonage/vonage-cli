import { spinner } from '../../ux/spinner.js';
import { appId, privateKey } from '../../credentialFlags.js';
import { confirm } from '../../ux/confirm.js';
import { conversationSummary } from '../../conversations/display.js';
import { sdkError } from '../../utils/sdkError.js';

export const command = 'list';

export const desc = 'List conversations';

export const builder = (yargs) => yargs.options({
  'page-size': {
    describe: 'Number of conversations to return per page',
    default: 1,
  },
  'cursor': {
    describe: 'Cursor for the next page',
  },
  'app-id': appId,
  'private-key': privateKey,
});

export const handler = async (argv) => {
  const { SDK, pageSize, cursor } = argv;
  console.info('List conversations');
  let pageCursor = cursor;
  let okToPage = false;

  do {
    console.debug(`Fetching conversations with cursor: ${pageCursor}`);
    const { stop, fail } = spinner({
      message: !okToPage
        ? 'Fetching conversations'
        : 'Fetching more conversations',
    });
    let response;
    try {
      response = await SDK.conversations.getConversationPage({
        pageSize: pageSize,
        cursor: pageCursor,
      });

      stop();
    } catch (error) {
      fail();
      sdkError(error);
      return;
    }

    const { conversations } = response;
    console.debug(`Fetched ${conversations.length} conversations`);

    if (conversations.length < 1) {
      console.log('No conversations found');
      continue;
    }

    console.log('');
    console.table(conversations.map(conversationSummary));

    pageCursor = response.links?.next?.href
      ? new URL(response.links.next.href).searchParams.get('cursor')
      : null;

    console.debug(`Next cursor: ${pageCursor}`);

    if (pageCursor !== null) {
      okToPage = await confirm('There are more conversations. Do you want to continue?');
    }
  } while (okToPage && pageCursor !== null);

  console.log('Done Listing conversations');
};
