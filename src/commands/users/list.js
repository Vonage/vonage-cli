import { appId, privateKey } from '../../credentialFlags.js';
import { confirm } from '../../ux/confirm.js';
import { userSummary } from '../../users/display.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { dumpCommand } from '../../ux/dump.js';
import { Client } from '@vonage/server-client';

export const command = 'list';

export const desc = 'List users';

/* istanbul ignore next */
export const builder = (yargs) => yargs.options({
  'page-size': {
    describe: 'Number of users to return per page',
    default: 100,
    group: 'Paging',
  },
  'cursor': {
    describe: 'Cursor for the next page',
    group: 'Paging',
  },
  'sort': {
    describe: 'Sort users by name in ascending or descending order',
    choices: ['ASC', 'DESC'],
    group: 'Paging',
  },
  'name': {
    describe: 'Filter by user name',
    group: 'User',
  },
  'app-id': appId,
  'private-key': privateKey,
})
  .epilogue([
    'Since there can be a larg nubmer of users, this command will prompt you to continue paging through the users.',
    `You can use the ${dumpCommand('--page-size')} flag to control the number of users returned per page.`,
  ].join(' '))
  .example(
    dumpCommand('vonage users list'),
    'List a page of users',
  );

export const handler = async (argv) => {
  const { SDK, pageSize, cursor } = argv;
  console.info('List users');
  let pageCursor = cursor;
  let okToPage = false;

  do {
    console.debug(`Fetching ${pageSize} users with cursor: ${pageCursor}`);
    const response = Client.transformers.snakeCaseObjectKeys(
      await makeSDKCall(
        SDK.users.getUserPage.bind(SDK.users),
        !okToPage
          ? 'Fetching users'
          : 'Fetching more users',
        {
          pageSize: pageSize,
          cursor: pageCursor,
          name: argv.name,
          sort: argv.sort,
        },
      ),
      true,
      true,
    );

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
