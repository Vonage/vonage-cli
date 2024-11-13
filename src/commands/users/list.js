const { spinner } = require('../../ux/spinner');
const { appId, privateKey } = require('../../credentialFlags');
const { confirm } = require('../../ux/confirm');
const { userSummary } = require('../../users/display');
const { sdkError } = require('../../utils/sdkError');
const { Client } = require('@vonage/server-client');

exports.command = 'list';

exports.desc = 'List users';

exports.builder = (yargs) => yargs.options({
  'page-size': {
    describe: 'Number of users to return per page',
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
  console.info('List users');
  let pageCursor = cursor;
  let okToPage = false;

  do {
    console.debug(`Fetching users with cursor: ${pageCursor}`);
    const { stop, fail } = spinner({
      message: !okToPage
        ? 'Fetching users'
        : 'Fetching more users',
    });
    let response;
    try {
      response = Client.transformers.camelCaseObjectKeys(
        await SDK.users.getUserPage({
          pageSize: pageSize,
          cursor: pageCursor,
        }),
        true,
      );

      stop();
    } catch (error) {
      fail();
      sdkError(error);
      return;
    }

    console.debug('Users fetched', response);

    console.log('');
    console.table([...(response.embedded?.users || [])].map(userSummary));

    pageCursor = response.links?.next?.href
      ? new URL(response.links.next.href).searchParams.get('cursor')
      : null;

    console.debug(`Next cursor: ${pageCursor}`);

    if (pageCursor !== null) {
      okToPage = await confirm('There are more users. Do you want to continue?');
    }
  } while (okToPage && pageCursor !== null);

  console.log('Done Listing users');
};
