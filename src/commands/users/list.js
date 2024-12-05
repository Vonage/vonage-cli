const { appId, privateKey } = require('../../credentialFlags');
const { confirm } = require('../../ux/confirm');
const { userSummary } = require('../../users/display');
const { makeSDKCall } = require('../../utils/makeSDKCall');

exports.command = 'list';

exports.desc = 'List users';

/* istanbul ignore next */
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
    const response = await makeSDKCall(
      SDK.users.getUserPage,
      !okToPage
        ? 'Fetching users'
        : 'Fetching more users',
      {
        pageSize: pageSize,
        cursor: pageCursor,
      },
    );

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
