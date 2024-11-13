const { appId, privateKey } = require('../../credentialFlags');
const { loadUserFromSDK } = require('../../users/loadUserFromSDK');
const { spinner } = require('../../ux/spinner');
const { confirm } = require('../../ux/confirm');
const { sdkError } = require('../../utils/sdkError');

exports.command = 'delete <id>';

exports.desc = 'Delete a user';

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

  const user = await loadUserFromSDK(SDK, id);
  if (!user) {
    console.error('No user found');
    return;
  }

  const okToDelete = await confirm('Are you sure you want to delete this user?');

  if (!okToDelete) {
    console.log('User not deleted');
    return;
  }

  const {stop, fail} = spinner({message: 'Deleting user'});

  try {
    await SDK.users.deleteUser(user.id);
    stop();
    console.log('');
    console.log('User deleted');
  } catch (error) {
    fail();
    sdkError(error);
  }
};
