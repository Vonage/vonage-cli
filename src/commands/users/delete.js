import { appId, privateKey } from '../../credentialFlags.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { confirm } from '../../ux/confirm.js';

export const command = 'delete <id>';

export const desc = 'Delete a user';

/* istanbul ignore next */
export const builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The user ID',
    })
  .options({
    'app-id': appId,
    'private-key': privateKey,
  });

export const handler = async (argv) => {
  const { SDK, id } = argv;
  console.info('Deleting user');

  const user = await makeSDKCall(
    SDK.users.getUser.bind(SDK.users),
    'Fetching User',
    id,
  );

  const okToDelete = await confirm('Are you sure you want to delete this user?');

  if (!okToDelete) {
    console.log('User not deleted');
    return;
  }

  await makeSDKCall(
    SDK.users.deleteUser.bind(SDK.users),
    'Deleting user',
    user.id,
  );
  console.log('');
  console.log('User deleted');
};
