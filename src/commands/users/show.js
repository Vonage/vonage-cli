const { appId, privateKey } = require('../../credentialFlags');
const { loadUserFromSDK } = require('../../users/loadUserFromSDK');
const { displayFullUser } = require('../../users/display');

exports.command = 'show <id>';

exports.desc = 'Show user';

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
  console.info('Showing user details');

  const user = await loadUserFromSDK(SDK, id);
  if (!user) {
    console.error('No user found');
    return;
  }

  console.log('');
  displayFullUser(user);
};
