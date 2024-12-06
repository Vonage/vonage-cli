const { appId, privateKey } = require('../../credentialFlags');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { confirm } = require('../../ux/confirm');

exports.command = 'delete <id>';

exports.desc = 'Delete a user';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The user ID',
    })
  .options({
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
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
