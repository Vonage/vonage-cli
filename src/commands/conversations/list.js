const { spinner } = require('../../ux/spinner');
const { appId, privateKey } = require('../../credentialFlags');
const { confirm } = require('../../ux/confirm');
const { conversationSummary } = require('../../conversations/display');
const { sdkError } = require('../../utils/sdkError');

exports.command = 'list';

exports.desc = 'List conversations';

exports.builder = (yargs) => yargs.options({
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

exports.handler = async (argv) => {
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

    console.log('');
    console.table([...response.conversations].map(conversationSummary));

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
