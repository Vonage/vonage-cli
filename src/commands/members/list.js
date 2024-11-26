const { spinner } = require('../../ux/spinner');
const { conversationIdFlag } = require('../../conversations/conversationFlags');
const { appId, privateKey } = require('../../credentialFlags');
const { confirm } = require('../../ux/confirm');
const { memberSummary } = require('../../members/display');
const { sdkError } = require('../../utils/sdkError');

exports.command = 'list <conversation-id>';

exports.desc = 'List members';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
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

exports.handler = async (argv) => {
  console.info('List members');
  const { SDK, pageSize, cursor, conversationId } = argv;

  let pageCursor = cursor;
  let okToPage = false;

  do {
    console.debug(`Fetching members for conversation ${conversationId} with cursor: ${pageCursor}`);
    const { stop, fail } = spinner({
      message: !okToPage
        ? 'Fetching members'
        : 'Fetching more members',
    });
    let response;
    try {
      response = await SDK.conversations.getMemberPage(
        conversationId,
        {
          pageSize: pageSize,
          cursor: pageCursor,
        },
      ),

      stop();
    } catch (error) {
      fail();
      sdkError(error);
      return;
    }

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
